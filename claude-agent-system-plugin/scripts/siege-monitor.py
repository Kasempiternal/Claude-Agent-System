#!/usr/bin/env python3
"""Siege Worker Progress Monitor — real-time progress display for claude -p workers.

Two modes:
  Wrapper mode (recommended): Spawns claude -p as a child process, monitors it,
    detects completion via NDJSON message_stop events, and kills it after a grace
    period. Prevents hangs where claude -p finishes work but the process doesn't exit.

    Usage: python3 siege-monitor.py --worker-type main --iteration 1 \
             --result-file ".claude/plans/siege-foo/worker-result-iter1.md" \
             -- claude -p "..." --output-format stream-json ...

  Pipe mode (legacy fallback): Reads NDJSON from stdin.

    Usage: claude -p "..." 2>&1 | python3 siege-monitor.py --worker-type main --iteration 1
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


def extract_path(text):
    """Try to pull a short file path from accumulated tool input JSON."""
    if not text:
        return None
    for key in ("file_path", "path", "pattern", "command", "file"):
        idx = text.find(f'"{key}"')
        if idx == -1:
            continue
        # Walk forward to the value
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


def detect_phase(tool_name, tool_input, state):
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

    if tool_name == "Write" and tool_input:
        if "project-tasks.md" in tool_input:
            return "Task list ready"
        if "worker-result-" in tool_input or "verify-result-" in tool_input:
            return "Writing result"
        if "hardening-result" in tool_input:
            return "Writing result"

    if tool_name == "Bash" and tool_input:
        low = tool_input.lower()
        if any(kw in low for kw in ["test", "pytest", "cargo test", "go test", "jest", "vitest", "mocha"]):
            return "Running tests"
        if any(kw in low for kw in ["build", "cargo build", "go build", "tsc", "webpack", "vite build"]):
            return "Running build"

    return None


# ── NDJSON event processing (shared between modes) ──────────────────────────


def process_event(event, start, state, counters):
    """Process a single NDJSON event. Returns (tool_count_delta, completion_detected)."""
    etype = event.get("type", "")
    elapsed = time.time() - start
    completion = False

    # ── message_start / message_stop: track message depth ──
    if etype == "message_start":
        counters["message_depth"] = counters.get("message_depth", 0) + 1
        return 0, False

    if etype == "message_stop":
        counters["message_depth"] = counters.get("message_depth", 0) - 1
        if counters["message_depth"] <= 0:
            completion = True
        return 0, completion

    # ── content_block_start: new tool use ──
    if etype == "content_block_start":
        cb = event.get("content_block", {})
        if cb.get("type") == "tool_use":
            counters["current_tool"] = cb.get("name", "?")
            counters["accumulated_input"] = ""

    # ── input_json_delta: accumulate tool input ──
    elif etype == "content_block_delta":
        delta = event.get("delta", {})
        if delta.get("type") == "input_json_delta":
            counters["accumulated_input"] = counters.get("accumulated_input", "") + delta.get("partial_json", "")

    # ── content_block_stop: tool call complete ──
    elif etype == "content_block_stop":
        current_tool = counters.get("current_tool")
        if current_tool:
            accumulated_input = counters.get("accumulated_input", "")
            path_hint = extract_path(accumulated_input)

            # Phase detection
            phase = detect_phase(current_tool, accumulated_input, state)
            if phase:
                flush_batch(counters.get("batch_tool"), counters.get("batch_count", 0),
                           counters.get("batch_start", 0.0), start)
                counters["batch_tool"] = None
                counters["batch_count"] = 0
                emit(f"{fmt_elapsed(elapsed)} PHASE   {phase}")

            # Batching: collapse rapid identical tool calls
            batch_tool = counters.get("batch_tool")
            batch_start = counters.get("batch_start", 0.0)
            if current_tool == batch_tool and (elapsed - batch_start) < 3.0:
                counters["batch_count"] = counters.get("batch_count", 0) + 1
            else:
                flush_batch(batch_tool, counters.get("batch_count", 0), batch_start, start)
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
    """Spawn claude -p as a child process, monitor it, kill on completion."""
    label = WORKER_TYPE_LABELS.get(args.worker_type, "WORKER")
    header = f"--- SIEGE WORKER [iter {args.iteration} / {label}] "
    header += "-" * max(1, 47 - len(header))
    emit(header)

    start = time.time()
    emit(f"{fmt_elapsed(0)} START   Worker session (opus) [wrapper mode]")

    # Build clean env: remove CLAUDECODE so child can launch
    env = os.environ.copy()
    env.pop("CLAUDECODE", None)

    # Spawn child in its own process group for clean kill
    child = subprocess.Popen(
        child_cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        env=env,
        start_new_session=True,
    )

    state = {}
    counters = {"message_depth": 0}
    tool_count = 0
    completion_detected = False
    completion_time = None
    child_fd = child.stdout.fileno()
    buf = b""

    try:
        while True:
            # Check if child exited naturally
            ret = child.poll()
            if ret is not None and not buf:
                break

            # Use short timeout once completion detected, 30s otherwise
            if completion_detected and completion_time:
                remaining = max(0.1, args.grace_period - (time.time() - completion_time))
                poll_timeout = min(remaining, 1.0)
            else:
                poll_timeout = 30.0
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
                        continue

                    delta, completed = process_event(event, start, state, counters)
                    tool_count += delta
                    if completed and not completion_detected:
                        completion_detected = True
                        completion_time = time.time()
                        elapsed = time.time() - start
                        emit(f"{fmt_elapsed(elapsed)} SIGNAL  Completion detected (message_stop depth=0)")
            else:
                # Timeout — poll for result file as backup signal
                if args.result_file and os.path.isfile(args.result_file) and not completion_detected:
                    completion_detected = True
                    completion_time = time.time()
                    elapsed = time.time() - start
                    emit(f"{fmt_elapsed(elapsed)} SIGNAL  Result file detected: {args.result_file}")

            # Grace period: if completion detected, wait then kill
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
    emit(f"{fmt_elapsed(elapsed)} DONE    {tool_count} tools | {time_str}")
    emit("-" * 47)

    # Exit code logic
    ret = child.poll()
    if ret is not None and ret == 0:
        # Natural clean exit
        sys.exit(0)
    elif completion_detected:
        # We killed it but work was done
        if args.result_file and os.path.isfile(args.result_file):
            sys.exit(0)
        else:
            # Completion signal but no result file — warn but don't fail hard
            sys.exit(0)
    elif ret is not None:
        sys.exit(ret)
    else:
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
    """Read NDJSON from stdin (original pipe mode)."""
    label = WORKER_TYPE_LABELS.get(args.worker_type, "WORKER")
    header = f"--- SIEGE WORKER [iter {args.iteration} / {label}] "
    header += "-" * max(1, 47 - len(header))
    emit(header)

    start = time.time()
    emit(f"{fmt_elapsed(0)} START   Worker session (opus)")

    # State tracking
    state = {}
    tool_count = 0
    current_tool = None
    accumulated_input = ""
    batch_tool = None
    batch_count = 0
    batch_start = 0.0

    # Ensure real-time line buffering on stdin
    if hasattr(sys.stdin, "reconfigure"):
        sys.stdin.reconfigure(line_buffering=True)  # type: ignore[attr-defined]

    try:
        for line in sys.stdin:
            line = line.strip()
            if not line:
                continue
            try:
                event = json.loads(line)
            except (json.JSONDecodeError, ValueError):
                continue

            etype = event.get("type", "")
            elapsed = time.time() - start

            # ── content_block_start: new tool use ──
            if etype == "content_block_start":
                cb = event.get("content_block", {})
                if cb.get("type") == "tool_use":
                    current_tool = cb.get("name", "?")
                    accumulated_input = ""

            # ── input_json_delta: accumulate tool input ──
            elif etype == "content_block_delta":
                delta = event.get("delta", {})
                if delta.get("type") == "input_json_delta":
                    accumulated_input += delta.get("partial_json", "")

            # ── content_block_stop: tool call complete ──
            elif etype == "content_block_stop":
                if current_tool:
                    tool_count += 1
                    path_hint = extract_path(accumulated_input)

                    # Phase detection
                    phase = detect_phase(current_tool, accumulated_input, state)
                    if phase:
                        flush_batch(batch_tool, batch_count, batch_start, start)
                        batch_tool = None
                        batch_count = 0
                        emit(f"{fmt_elapsed(elapsed)} PHASE   {phase}")

                    # Batching: collapse rapid identical tool calls
                    if current_tool == batch_tool and (elapsed - batch_start) < 3.0:
                        batch_count += 1
                    else:
                        flush_batch(batch_tool, batch_count, batch_start, start)
                        batch_tool = current_tool
                        batch_count = 1
                        batch_start = elapsed
                        # Emit individual tool line (will be replaced if batched)
                        suffix = f" -> {path_hint}" if path_hint else ""
                        emit(f"{fmt_elapsed(elapsed)} TOOL    {current_tool}{suffix}")

                    current_tool = None
                    accumulated_input = ""

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
        elapsed = batch_start
        # Overwrite the individual line with the batch summary
        emit(f"{fmt_elapsed(elapsed)} TOOL    {tool} x{count}")


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
        child_cmd = argv[sep + 1 :]

    parser = argparse.ArgumentParser(description="Siege worker progress monitor")
    parser.add_argument(
        "--worker-type",
        choices=["main", "verifier", "hardening", "simplifier"],
        default="main",
    )
    parser.add_argument("--iteration", type=int, default=1)
    parser.add_argument("--result-file", default=None,
                        help="Path to result file to poll for completion (wrapper mode)")
    parser.add_argument("--grace-period", type=int, default=15,
                        help="Seconds to wait after completion before killing (default: 15)")
    args = parser.parse_args(monitor_argv)

    if child_cmd:
        run_as_wrapper(child_cmd, args)
    else:
        run_as_pipe(args)


if __name__ == "__main__":
    main()
