#!/usr/bin/env node
/**
 * /goal — deterministic state CLI
 *
 * Subcommands:
 *   create <objective> [--max-iter N] [--yield-every N]
 *   pause
 *   resume
 *   clear
 *   status
 *
 * Exits non-zero only on usage errors. Goal-state errors (e.g. "second goal")
 * exit 0 with a clear stderr message so the wrapping skill can show it cleanly.
 *
 * State files:
 *   .cas/goals/active.json    durable
 *   .cas/goals/.runtime.json  transient (sessionId, transcriptPath)
 *   .cas/goals/archive/       cleared/replaced goals
 */

const path = require('path');
const lib = require(path.join(__dirname, '..', 'lib', 'state.js'));

const DEFAULTS = {
  maxIterations: 50,
  yieldEvery: 5,
};

function parseFlags(args) {
  const out = { positional: [], flags: {} };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--max-iter' || a === '--yield-every') {
      const n = Number(args[++i]);
      if (!Number.isFinite(n) || n < 0) usageError(`${a} requires a non-negative number`);
      out.flags[a] = n;
    } else if (a.startsWith('--max-iter=')) {
      out.flags['--max-iter'] = Number(a.slice('--max-iter='.length));
    } else if (a.startsWith('--yield-every=')) {
      out.flags['--yield-every'] = Number(a.slice('--yield-every='.length));
    } else {
      out.positional.push(a);
    }
  }
  return out;
}

function usageError(msg) {
  process.stderr.write(`/goal: ${msg}\n`);
  process.stderr.write('Usage: /goal <objective> | pause | resume | clear | status\n');
  process.exit(2);
}

function softError(msg) {
  process.stderr.write(`${msg}\n`);
  process.exit(0);
}

function printBanner(state) {
  process.stdout.write(lib.formatBanner(state) + '\n');
}

function projectDir() {
  return lib.resolveProjectDir(null);
}

function loadState() {
  const { activeFile } = lib.paths(projectDir());
  return lib.readJSON(activeFile);
}

function saveState(state) {
  const { activeFile } = lib.paths(projectDir());
  lib.writeJSON(activeFile, state);
}

function saveRuntime(runtime) {
  const { runtimeFile } = lib.paths(projectDir());
  lib.writeJSON(runtimeFile, runtime);
}

function cmdCreate(args) {
  const parsed = parseFlags(args);
  const objective = parsed.positional.join(' ').trim();
  if (!objective) usageError('goal objective must not be empty');
  if (objective.length > 2000) usageError('goal objective must be at most 2000 characters');

  const maxIterations = parsed.flags['--max-iter']    ?? DEFAULTS.maxIterations;
  const yieldEvery    = parsed.flags['--yield-every'] ?? DEFAULTS.yieldEvery;

  if (maxIterations <= 0) usageError('--max-iter must be positive');

  const existing = loadState();
  if (existing && !lib.TERMINAL_STATUSES.includes(existing.status)) {
    softError('cannot create a new goal because this thread already has a goal; clear it first with /goal clear');
  }
  if (existing) {
    lib.archive(projectDir(), existing);
  }

  const state = lib.newGoal({ objective, maxIterations, yieldEvery });
  saveState(state);
  saveRuntime({
    sessionId: null,
    transcriptPath: null,
    lastTickAt: null,
  });

  printBanner(state);
  process.stdout.write('\n--\nDirective: You have an active goal. Begin pursuing it now.\n');
  process.stdout.write('When you believe the goal is complete, edit .cas/goals/active.json and set "status" to "achieved".\n');
  process.stdout.write('If the goal is unachievable, set "status" to "abandoned" and append a reason to "history".\n');
}

function cmdPause() {
  const state = loadState();
  if (!state) softError('No goal is currently set.');
  if (state.status === 'paused') softError('Goal is already paused.');
  if (state.status !== 'active') softError(`Cannot pause goal in status "${state.status}". Use /goal clear.`);
  state.status = 'paused';
  lib.appendHistory(state, 'paused');
  saveState(state);
  printBanner(state);
}

function cmdResume() {
  const state = loadState();
  if (!state) softError('No goal is currently set.');
  if (state.status === 'active') softError('Goal is already active.');
  if (state.status !== 'paused') softError(`Cannot resume goal in status "${state.status}". Use /goal clear.`);
  state.status = 'active';
  lib.appendHistory(state, 'resumed');
  saveState(state);
  printBanner(state);
  process.stdout.write('\n--\nDirective: Continue pursuing the active goal.\n');
}

function cmdClear() {
  const state = loadState();
  if (!state) softError('No goal is currently set.');
  lib.appendHistory(state, 'cleared');
  state.status = 'cleared';
  lib.archive(projectDir(), state);
  process.stdout.write('Goal cleared.\n');
}

function cmdStatus() {
  const state = loadState();
  printBanner(state);
}

function main() {
  const [, , subcommand, ...rest] = process.argv;
  if (!subcommand) usageError('missing subcommand');

  switch (subcommand) {
    case 'create': return cmdCreate(rest);
    case 'pause':  return cmdPause();
    case 'resume': return cmdResume();
    case 'clear':  return cmdClear();
    case 'status': return cmdStatus();
    default:
      return usageError(`unknown subcommand: ${subcommand}`);
  }
}

main();
