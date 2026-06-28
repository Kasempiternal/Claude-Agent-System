#!/usr/bin/env node
/**
 * SessionStart hook — orchestrator resume pointer.
 *
 * If the project has an orchestrate workspace with still-open (non-archived) handoff
 * files, inject a one-line pointer so a fresh session can rehydrate those threads.
 * Otherwise emit nothing. Must be cheap and silent for every other CAS user — it runs
 * on EVERY session start, so it never throws and never blocks.
 *
 * Output contract (Claude Code SessionStart):
 *   {"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"..."}}
 */

const fs = require('fs');
const path = require('path');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (_) {
    return '';
  }
}

function main() {
  let input = {};
  try { input = JSON.parse(readStdin() || '{}'); } catch (_) { input = {}; }

  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.env.PWD || process.cwd();
  const plansDir = path.join(projectDir, '.cas', 'plans');

  let workspaces;
  try {
    workspaces = fs.readdirSync(plansDir).filter(f => f.startsWith('orchestrate-'));
  } catch (_) {
    return; // no plans dir → nothing to resume, stay silent
  }

  const open = [];
  for (const ws of workspaces) {
    let living = [];
    try {
      living = fs.readdirSync(path.join(plansDir, ws)).filter(f => /^handoff-.*\.md$/.test(f));
    } catch (_) { /* skip */ }
    if (living.length) open.push({ ws, living });
  }

  if (!open.length) return; // nothing open → silent

  const lines = open.map(o => `  - .cas/plans/${o.ws}/ — open threads: ${o.living.join(', ')}`).join('\n');
  const context =
    'Orchestrator: this project has open handoff threads from a previous session ' +
    '(live agents do not survive across sessions — only their handoff files do):\n' +
    lines +
    '\nTo resume a thread, read its handoff-<agent>.md and re-spawn a fresh agent from it. ' +
    'Archive (move to archive/) any thread that is actually finished.';

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: context,
    },
  }) + '\n');
}

try { main(); } catch (_) { /* never break session start */ }
process.exit(0);
