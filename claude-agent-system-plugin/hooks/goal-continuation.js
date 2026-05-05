#!/usr/bin/env node
/**
 * /goal — Stop hook driving auto-continuation
 *
 * Reads stdin JSON from Claude Code (session_id, transcript_path, cwd,
 * stop_hook_active, last_assistant_message). If a goal is active in the
 * project, applies guards and either:
 *   - exits 0 silently (state remains paused/terminal/yielded), or
 *   - emits {"decision":"block","reason":"..."} to force another turn.
 *
 * Guards (in order):
 *   no state file                → silent exit
 *   status != active             → silent exit
 *   absolute ceiling reached     → flip abandoned, silent exit (belt-and-suspenders)
 *   max iterations               → flip abandoned, silent exit
 *   no tool calls last turn      → flip abandoned (livelock guard)
 *   yield-every tick             → silent exit, leave status=active
 *   else                         → emit decision:block (continuation directive)
 *
 * Deliberately does NOT exit on stop_hook_active=true. Exiting on it would
 * cap goal pursuit at a single auto-continuation, breaking codex parity.
 *
 * Setup in claude-agent-system-plugin/hooks/hooks.json (Stop array).
 */

const fs = require('fs');
const path = require('path');

const PLUGIN_LIB = path.resolve(__dirname, '..', 'skills', 'goal', 'lib', 'state.js');
const lib = require(PLUGIN_LIB);

const LOG_DIR = path.join(process.env.HOME || '/tmp', '.claude', 'hooks-logs');

function log(data) {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    const file = path.join(LOG_DIR, `${new Date().toISOString().slice(0, 10)}.jsonl`);
    fs.appendFileSync(file, JSON.stringify({ ts: new Date().toISOString(), hook: 'goal-continuation', ...data }) + '\n');
  } catch {}
}

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function main() {
  let input = {};
  try {
    const raw = readStdin();
    if (raw) input = JSON.parse(raw);
  } catch (err) {
    log({ event: 'parse_error', error: String(err) });
    process.exit(0);
  }

  const projectDir = lib.resolveProjectDir(input);
  const { activeFile, runtimeFile } = lib.paths(projectDir);

  const state = lib.readJSON(activeFile);
  if (!state) process.exit(0);

  if (state.status !== 'active') process.exit(0);

  const runtime = lib.readJSON(runtimeFile) || {};

  state.iterations = (state.iterations || 0) + 1;
  state.updatedAt = lib.nowISO();

  runtime.sessionId = input.session_id || runtime.sessionId || null;
  runtime.transcriptPath = input.transcript_path || runtime.transcriptPath || null;
  runtime.lastTickAt = state.updatedAt;

  const ABSOLUTE_CEILING = (state.maxIterations || 50) * 2;
  if (state.iterations >= ABSOLUTE_CEILING) {
    return terminal(projectDir, state, runtime, 'abandoned', `absolute safety ceiling reached (${ABSOLUTE_CEILING} iterations)`);
  }

  if (state.iterations >= (state.maxIterations || 50)) {
    return terminal(projectDir, state, runtime, 'abandoned', 'max iterations reached');
  }

  if (lib.lastTurnHadNoToolCalls(input.transcript_path)) {
    return terminal(projectDir, state, runtime, 'abandoned', 'livelock guard: no tool calls in last turn');
  }

  const yieldEvery = Number(state.yieldEvery);
  if (yieldEvery > 0 && state.iterations % yieldEvery === 0) {
    lib.writeJSON(activeFile, state);
    lib.writeJSON(runtimeFile, runtime);
    process.stderr.write(
      `/goal yield window (iteration ${state.iterations}/${state.maxIterations}). ` +
      `Type /goal pause | status | clear, or any message to continue pursuit.\n`
    );
    log({ event: 'yield', iterations: state.iterations, sessionId: runtime.sessionId });
    process.exit(0);
  }

  lib.writeJSON(activeFile, state);
  lib.writeJSON(runtimeFile, runtime);

  const reason =
    `Continue pursuing the active goal:\n\n${state.objective}\n\n` +
    `Iteration ${state.iterations}/${state.maxIterations}. ` +
    `When you believe the goal is complete, edit .cas/goals/active.json and set "status" to "achieved". ` +
    `If the goal is unachievable, set "status" to "abandoned" and append a reason to "history".`;

  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  log({ event: 'continue', iterations: state.iterations, sessionId: runtime.sessionId });
  process.exit(0);
}

function terminal(projectDir, state, runtime, newStatus, reason) {
  state.status = newStatus;
  lib.appendHistory(state, newStatus, reason);
  const { activeFile, runtimeFile } = lib.paths(projectDir);
  lib.writeJSON(activeFile, state);
  lib.writeJSON(runtimeFile, runtime);
  log({ event: 'terminal', status: newStatus, reason, iterations: state.iterations });
  process.exit(0);
}

main();
