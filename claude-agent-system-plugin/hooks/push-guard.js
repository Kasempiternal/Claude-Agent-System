#!/usr/bin/env node
/**
 * Push Guard - PreToolUse Hook for Bash
 * Intercepts git push commands and escalates to user confirmation.
 * Commits are allowed freely - only pushes require approval.
 *
 * Returns "ask" so Claude Code prompts the user instead of silently blocking.
 * Logs to: ~/.claude/hooks-logs/
 *
 * Setup in .claude/settings.json:
 * {
 *   "hooks": {
 *     "PreToolUse": [{
 *       "matcher": "Bash",
 *       "hooks": [{ "type": "command", "command": "node /path/to/push-guard.js" }]
 *     }]
 *   }
 * }
 */

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(process.env.HOME, '.claude', 'hooks-logs');

function log(data) {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
    const file = path.join(LOG_DIR, `${new Date().toISOString().slice(0, 10)}.jsonl`);
    fs.appendFileSync(file, JSON.stringify({ ts: new Date().toISOString(), hook: 'push-guard', ...data }) + '\n');
  } catch {}
}

const PUSH_PATTERNS = [
  { id: 'git-push',       regex: /\bgit\s+push\b/,                  reason: 'git push detected' },
  { id: 'gh-pr-create',   regex: /\bgh\s+pr\s+create\b/,            reason: 'gh pr create (implies push)' },
  { id: 'git-push-force', regex: /\bgit\s+push\b.+(--force|-f)\b/,  reason: 'force push detected' },
];

async function main() {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;

  try {
    const data = JSON.parse(input);
    const { tool_name, tool_input, session_id, cwd, permission_mode } = data;

    if (tool_name !== 'Bash') return console.log('{}');

    const cmd = tool_input?.command || '';

    for (const p of PUSH_PATTERNS) {
      if (p.regex.test(cmd)) {
        log({ level: 'ASK', id: p.id, cmd, session_id, cwd, permission_mode });
        return console.log(JSON.stringify({
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'ask',
            permissionDecisionReason: `[push-guard] ${p.reason} — approve to proceed`
          }
        }));
      }
    }

    console.log('{}');
  } catch (e) {
    log({ level: 'ERROR', error: e.message });
    console.log('{}');
  }
}

if (require.main === module) {
  main();
} else {
  module.exports = { PUSH_PATTERNS };
}
