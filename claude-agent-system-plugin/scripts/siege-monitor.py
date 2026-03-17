#!/usr/bin/env python3
"""Siege Worker Progress Monitor v2 — proper completion detection for claude -p.

Wrapper mode (recommended):
  Spawns claude -p as a child process, monitors NDJSON events, detects completion
  via the "result" event type, and kills the process after a grace period.

  Usage: python3 siege-monitor.py \
           --prompt-file "context.md" \
           --result-file "result.md" \
           --max-duration 2700 \
           -- claude -p --model opus --verbose --output-format stream-json

  The prompt file is piped to claude -p via stdin, avoiding shell escaping issues.

Pipe mode (legacy): Reads NDJSON from stdin for progress display only.
"""

import sys
import json
import time
import os
import signal
import argparse
import select
import subprocess

# ── Phase detection patterns ────────────────────────────────────────────────

WORKER_TYPE_LABELS = {
    "main": "FULL",
    "verifier": "VERIFY",
    "hardening": "HARDEN",
    "simplifier": "SIMPLIFY",
}

# ── Helpers ─────────────────────────────────────────────────────────────────


def fmt_elapsed(seconds):
    """Format seconds as [MM:SS]."""
    m, s = divmod(int(seconds), 60)
    return f"[{m:02d}:{s:02d}]"


def extract_path_from_input(tool_input):
    """Extract a short file path or command hint from tool input dict."""
    if not isinstance(tool_input, dict):
        return None
    for key in ("file_path", "path", "pattern", "command", "file"):
        val = tool_input.get(key)
        if not val or not isinstance(val, str):
            continue
        # Shorten absolute paths
        if "/" in val:
            parts = val.rsplit("/", 2)
            if len(parts) >= 2:
                val = "/".join(parts[-2:])
        # Truncate long values
        if len(val) > 60:
            val = val[:57] + "..."
        return val
    return None


def extract_path_from_text(text):
    """Try to pull a short file path from accumulated JSON text (streaming mode)."""
    if not text:
        return None
    for key in ("file_path", "path", "pattern", "command", "file"):
        idx = text.find(f'"{key}"')
        if idx == -1:
            continue
        colon = text.find(":", idx)
        if colon == -1:
            continue
        quote_start = text.find('"', colon)
        if quote_start == -1:
            continue
        quote_end = text.find('"', quote_start + 1)
        if quote_end == -1:
            continue
        val = text[quote_start + 1 : quote_end]
        if "/" in val:
            parts = val.rsplit("/", 2)
            if len(parts) >= 2:
                val = "/".join(parts[-2:])
        if len(val) > 60:
            val = val[:57] + "..."
        return val
    return None


def detect_phase(tool_name, tool_input_str, state):
    """Return a phase string if this tool call represents a milestone, else None."""
    if tool_name == "TeamCreate":
        return "Team created"

    if tool_name == "TeamDelete":
        return "Team cleanup"

    if tool_name == "TaskCreate":
        state["task_creates"] = state.get("task_creates", 0) + 1
        count = state["task_creates"]
        if not state.get("scouts_deployed") and count >= 3:
            state["scouts_deployed"] = True
            return "Scouts deployed"
        if state.get("scouts_deployed") and not state.get("wave_started"):
            state["wave_count"] = state.get("wave_count", 0) + 1
            if count >= state.get("last_task_batch", 0) + 3:
                state["wave_started"] = True
                state["last_task_batch"] = count
                wn = state["wave_count"]
                return f"Wave {wn} starting"
        return None

    if tool_name == "Write" and tool_input_str:
        if "project-tasks.md" in tool_input_str:
            return "Task list ready"
        if "worker-result-" in tool_input_str or "verify-result-" in tool_input_str:
            return "Writing result"
        if "hardening-result" in tool_input_str:
            return "Writing result"
        if "simplifier-result" in tool_input_str:
            return "Writing result"

    if tool_name == "Bash" and tool_input_str:
        low = tool_input_str.lower()
        if any(kw in low for kw in ["test", "pytest", "cargo test", "go test", "jest", "vitest", "mocha"]):
            return "Running tests"
        if any(kw in low for kw in ["build", "cargo build", "go build", "tsc", "webpack", "vite build"]):
            return "Running build"

    return None


# ── NDJSON event processing ──────────────────────────────────────────────────


def process_event(event, start, state, counters):
    """Process a single NDJSON event. Returns (tool_count_delta, completion_detected).

    Handles two event formats:
    1. claude -p batched format: "assistant"/"user"/"result" event types
    2. Streaming format (fallback): "content_block_start"/"content_block_stop"
    """
    etype = event.get("type", "")
    elapsed = time.time() - start

    # ── SESSION INIT: log model and session info ──
    if etype == "system":
        subtype = event.get("subtype", "")
        if subtype == "init":
            model = event.get("model", "unknown")
            mode = event.get("permissionMode", "")
            if not counters.get("init_logged"):
                counters["init_logged"] = True
                emit(f"{fmt_elapsed(elapsed)} INIT    model={model} mode={mode}")
        return 0, False

    # ── PRIMARY COMPLETION: "result" event from claude -p ──
    if etype == "result":
        subtype = event.get("subtype", "")
        is_error = event.get("is_error", False)
        cost = event.get("total_cost_usd")
        turns = event.get("num_turns", "?")
        status = "error" if is_error else subtype
        cost_str = f" cost=${cost:.2f}" if cost else ""
        emit(f"{fmt_elapsed(elapsed)} SIGNAL  Session ended ({status}) turns={turns}{cost_str}")
        return 0, True

    # ── PROGRESS: "assistant" events contain tool use in message.content ──
    if etype == "assistant":
        message = event.get("message", {})
        content = message.get("content", [])
        delta = 0
        seen_ids = counters.setdefault("seen_tool_ids", set())

        for block in content:
            if block.get("type") != "tool_use":
                continue
            tool_id = block.get("id")
            if tool_id and tool_id in seen_ids:
                continue
            if tool_id:
                seen_ids.add(tool_id)

            tool_name = block.get("name", "?")
            tool_input = block.get("input", {})
            tool_input_str = json.dumps(tool_input) if isinstance(tool_input, dict) else str(tool_input)
            path_hint = extract_path_from_input(tool_input)

            # Phase detection
            phase = detect_phase(tool_name, tool_input_str, state)
            if phase:
                flush_batch(counters.get("batch_tool"), counters.get("batch_count", 0),
                           counters.get("batch_start", 0.0), start)
                counters["batch_tool"] = None
                counters["batch_count"] = 0
                emit(f"{fmt_elapsed(elapsed)} PHASE   {phase}")

            # Batching: collapse rapid identical tool calls
            batch_tool = counters.get("batch_tool")
            batch_start = counters.get("batch_start", 0.0)
            if tool_name == batch_tool and (elapsed - batch_start) < 3.0:
                counters["batch_count"] = counters.get("batch_count", 0) + 1
            else:
                flush_batch(batch_tool, counters.get("batch_count", 0), batch_start, start)
                counters["batch_tool"] = tool_name
                counters["batch_count"] = 1
                counters["batch_start"] = elapsed
                suffix = f" -> {path_hint}" if path_hint else ""
                emit(f"{fmt_elapsed(elapsed)} TOOL    {tool_name}{suffix}")

            delta += 1

        return delta, False

    # ── FALLBACK: streaming format (for future claude -p versions) ──
    if etype == "content_block_start":
        cb = event.get("content_block", {})
        if cb.get("type") == "tool_use":
            counters["current_tool"] = cb.get("name", "?")
            counters["accumulated_input"] = ""

    elif etype == "content_block_delta":
        delta = event.get("delta", {})
        if delta.get("type") == "input_json_delta":
            counters["accumulated_input"] = counters.get("accumulated_input", "") + delta.get("partial_json", "")

    elif etype == "content_block_stop":
        current_tool = counters.get("current_tool")
        if current_tool:
            accumulated_input = counters.get("accumulated_input", "")
            path_hint = extract_path_from_text(accumulated_input)

            phase = detect_phase(current_tool, accumulated_input, state)
            if phase:
                flush_batch(counters.get("batch_tool"), counters.get("batch_count", 0),
                           counters.get("batch_start", 0.0), start)
                counters["batch_tool"] = None
                counters["batch_count"] = 0
                emit(f"{fmt_elapsed(elapsed)} PHASE   {phase}")

            batch_tool = counters.get("batch_tool")
            batch_start_time = counters.get("batch_start", 0.0)
            if current_tool == batch_tool and (elapsed - batch_start_time) < 3.0:
                counters["batch_count"] = counters.get("batch_count", 0) + 1
            else:
                flush_batch(batch_tool, counters.get("batch_count", 0), batch_start_time, start)
                counters["batch_tool"] = current_tool
                counters["batch_count"] = 1
                counters["batch_start"] = elapsed
                suffix = f" -> {path_hint}" if path_hint else ""
                emit(f"{fmt_elapsed(elapsed)} TOOL    {current_tool}{suffix}")

            counters["current_tool"] = None
            counters["accumulated_input"] = ""
            return 1, False

    return 0, False


# ── Wrapper mode ────────────────────────────────────────────────────────────


def run_as_wrapper(child_cmd, args):
    """Spawn claude -p as a child process, monitor it, kill on completion or timeout."""
    label = WORKER_TYPE_LABELS.get(args.worker_type, "WORKER")
    header = f"--- SIEGE WORKER [iter {args.iteration} / {label}] "
    header += "-" * max(1, 47 - len(header))
    emit(header)

    start = time.time()
    mode_info = "wrapper"
    if args.prompt_file:
        mode_info += " + stdin prompt"
    emit(f"{fmt_elapsed(0)} START   Worker session (opus) [{mode_info}]")
    if args.max_duration:
        emit(f"{fmt_elapsed(0)} LIMIT   Hard timeout: {args.max_duration // 60}m{args.max_duration % 60:02d}s")

    # Build clean env: remove CLAUDECODE so child can launch
    env = os.environ.copy()
    env.pop("CLAUDECODE", None)

    # Open prompt file for stdin piping (avoids shell escaping issues)
    stdin_source = None
    if args.prompt_file:
        if not os.path.isfile(args.prompt_file):
            emit(f"ERROR   Prompt file not found: {args.prompt_file}")
            sys.exit(1)
        stdin_source = open(args.prompt_file, "r")

    # Spawn child in its own process group for clean kill
    child = subprocess.Popen(
        child_cmd,
        stdin=stdin_source if stdin_source else subprocess.DEVNULL,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        env=env,
        start_new_session=True,
    )

    # Close the file handle after Popen inherits it
    if stdin_source:
        stdin_source.close()

    state = {}
    counters = {}
    tool_count = 0
    completion_detected = False
    completion_time = None
    last_result_check = start
    child_fd = child.stdout.fileno()
    buf = b""

    try:
        while True:
            # ── Hard timeout: kill worker if max duration exceeded ──
            if args.max_duration and (time.time() - start) >= args.max_duration:
                elapsed = time.time() - start
                emit(f"{fmt_elapsed(elapsed)} TIMEOUT Hard timeout ({args.max_duration}s) exceeded, killing worker")
                _kill_child(child)
                break

            # ── Check if child exited naturally ──
            ret = child.poll()
            if ret is not None and not buf:
                break

            # ── Select: shorter timeout for responsive checks ──
            if completion_detected and completion_time:
                remaining = max(0.1, args.grace_period - (time.time() - completion_time))
                poll_timeout = min(remaining, 1.0)
            else:
                poll_timeout = 5.0  # Check result file every 5s

            readable, _, _ = select.select([child_fd], [], [], poll_timeout)

            if readable:
                chunk = os.read(child_fd, 65536)
                if not chunk:
                    # EOF — child closed stdout
                    break
                buf += chunk

                # Process complete lines
                while b"\n" in buf:
                    line_bytes, buf = buf.split(b"\n", 1)
                    line = line_bytes.decode("utf-8", errors="replace").strip()
                    if not line:
                        continue
                    try:
                        event = json.loads(line)
                    except (json.JSONDecodeError, ValueError):
                        # Non-JSON output — likely an error message from claude -p
                        if line.startswith("Error:") or line.startswith("error:"):
                            emit(f"{fmt_elapsed(time.time() - start)} ERROR   {line}")
                        continue

                    delta, completed = process_event(event, start, state, counters)
                    tool_count += delta
                    if completed and not completion_detected:
                        completion_detected = True
                        completion_time = time.time()

            # ── Result file check: runs every cycle regardless of output ──
            now = time.time()
            if now - last_result_check >= 10:
                last_result_check = now
                if args.result_file and os.path.isfile(args.result_file) and not completion_detected:
                    completion_detected = True
                    completion_time = now
                    elapsed = now - start
                    emit(f"{fmt_elapsed(elapsed)} SIGNAL  Result file detected: {args.result_file}")

            # ── Grace period: kill after completion detected ──
            if completion_detected and completion_time:
                waited = time.time() - completion_time
                if waited >= args.grace_period:
                    elapsed = time.time() - start
                    emit(f"{fmt_elapsed(elapsed)} KILL    Grace period ({args.grace_period}s) expired, terminating worker")
                    _kill_child(child)
                    break

    except KeyboardInterrupt:
        emit(f"{fmt_elapsed(time.time() - start)} ABORT   Keyboard interrupt")
        _kill_child(child)

    # Flush any remaining batch
    flush_batch(counters.get("batch_tool"), counters.get("batch_count", 0),
                counters.get("batch_start", 0.0), start)

    # Summary
    elapsed = time.time() - start
    m, s = divmod(int(elapsed), 60)
    time_str = f"{m}m{s:02d}s" if m else f"{s}s"
    has_result = args.result_file and os.path.isfile(args.result_file)
    result_status = "result file OK" if has_result else "NO RESULT FILE"
    emit(f"{fmt_elapsed(elapsed)} DONE    {tool_count} tools | {time_str} | {result_status}")
    emit("-" * 47)

    # Exit code logic:
    # - 0: result file exists (work was done) OR child exited cleanly with code 0
    # - 1: no result file and child didn't exit cleanly (crash, timeout, or error)
    ret = child.poll()
    if has_result:
        sys.exit(0)
    elif ret is not None and ret == 0 and not args.result_file:
        # Child exited cleanly and no result file was expected
        sys.exit(0)
    elif ret is not None and ret != 0:
        emit(f"WARNING: Worker exited with code {ret} and no result file")
        sys.exit(1)
    else:
        emit("WARNING: Worker finished without producing result file")
        sys.exit(1)


def _kill_child(child):
    """Graceful shutdown: SIGTERM the process group, wait, then SIGKILL if needed."""
    try:
        os.killpg(child.pid, signal.SIGTERM)
    except (ProcessLookupError, PermissionError):
        return
    try:
        child.wait(timeout=5)
    except subprocess.TimeoutExpired:
        try:
            os.killpg(child.pid, signal.SIGKILL)
        except (ProcessLookupError, PermissionError):
            pass
        try:
            child.wait(timeout=3)
        except subprocess.TimeoutExpired:
            pass


# ── Pipe mode (legacy) ──────────────────────────────────────────────────────


def run_as_pipe(args):
    """Read NDJSON from stdin for progress display (no completion detection)."""
    label = WORKER_TYPE_LABELS.get(args.worker_type, "WORKER")
    header = f"--- SIEGE WORKER [iter {args.iteration} / {label}] "
    header += "-" * max(1, 47 - len(header))
    emit(header)

    start = time.time()
    emit(f"{fmt_elapsed(0)} START   Worker session (opus) [pipe mode]")

    state = {}
    counters = {}
    tool_count = 0

    if hasattr(sys.stdin, "reconfigure"):
        sys.stdin.reconfigure(line_buffering=True)

    try:
        for line in sys.stdin:
            line = line.strip()
            if not line:
                continue
            try:
                event = json.loads(line)
            except (json.JSONDecodeError, ValueError):
                continue

            delta, _ = process_event(event, start, state, counters)
            tool_count += delta

    except (BrokenPipeError, KeyboardInterrupt):
        pass

    # Summary
    elapsed = time.time() - start
    m, s = divmod(int(elapsed), 60)
    time_str = f"{m}m{s:02d}s" if m else f"{s}s"
    emit(f"{fmt_elapsed(elapsed)} DONE    {tool_count} tools | {time_str}")
    emit("-" * 47)


# ── Shared utilities ────────────────────────────────────────────────────────


def flush_batch(tool, count, batch_start, _global_start=None):
    """If a batch of 2+ identical tools accumulated, emit a summary line."""
    if tool and count >= 2:
        emit(f"{fmt_elapsed(batch_start)} TOOL    {tool} x{count}")


def emit(line):
    """Print a line and flush immediately for real-time display."""
    try:
        print(line, flush=True)
    except BrokenPipeError:
        sys.exit(0)


# ── Main ────────────────────────────────────────────────────────────────────


def main():
    # Split args at '--' to detect wrapper mode
    argv = sys.argv[1:]
    child_cmd = None
    monitor_argv = argv

    if "--" in argv:
        sep = argv.index("--")
        monitor_argv = argv[:sep]
        child_cmd = argv[sep + 1:]

    parser = argparse.ArgumentParser(description="Siege worker progress monitor")
    parser.add_argument(
        "--worker-type",
        choices=["main", "verifier", "hardening", "simplifier"],
        default="main",
    )
    parser.add_argument("--iteration", type=int, default=1)
    parser.add_argument("--result-file", default=None,
                        help="Path to result file to poll for completion")
    parser.add_argument("--prompt-file", default=None,
                        help="Prompt file to pipe as stdin to claude -p (avoids shell escaping)")
    parser.add_argument("--grace-period", type=int, default=15,
                        help="Seconds to wait after completion before killing (default: 15)")
    parser.add_argument("--max-duration", type=int, default=2700,
                        help="Hard timeout in seconds — kill worker if exceeded (default: 2700 = 45min)")
    args = parser.parse_args(monitor_argv)

    if child_cmd:
        run_as_wrapper(child_cmd, args)
    else:
        run_as_pipe(args)


if __name__ == "__main__":
    main()
