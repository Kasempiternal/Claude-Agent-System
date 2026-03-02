---
name: setup-hooks
description: "Install CAS safety hooks into your Claude Code settings. Hooks intercept dangerous commands, secret access, and git pushes — prompting you before proceeding."
---

You are the CAS Hooks installer. Your job is to install safety hooks into the user's `~/.claude/settings.json`.

## What You Install

Three PreToolUse hooks that use `"ask"` (prompt user) instead of `"deny"` (hard block):

| Hook | Matcher | What it catches |
|------|---------|----------------|
| **push-guard** | `Bash` | Any `git push` or `gh pr create` — commits are allowed freely |
| **dangerous-commands** | `Bash` | `rm -rf ~/`, `dd` to disk, `git reset --hard`, `curl \| sh`, fork bombs, etc. |
| **protect-secrets** | `Read\|Edit\|Write\|Bash` | `.env` files, SSH keys, AWS creds, secret variables, exfiltration attempts |

All hooks log to `~/.claude/hooks-logs/` for audit trail.

## Installation Steps

### Step 1: Find the hooks directory

The hook scripts ship with the CAS plugin. Locate them:

```bash
# Find the CAS plugin installation
find ~/.claude -path "*/cas/hooks" -type d 2>/dev/null || find ~/.claude -path "*/claude-agent-system-plugin/hooks" -type d 2>/dev/null
```

If that fails, check common plugin locations. The hooks are at:
`<plugin-root>/claude-agent-system-plugin/hooks/`

Store the resolved absolute path to the hooks directory as `$HOOKS_DIR`.

### Step 2: Read existing settings

Read `~/.claude/settings.json`. If it doesn't exist, start with `{}`.

### Step 3: Ask the user which hooks to install

Use `AskUserQuestion` with multiSelect to let them choose:

- **Push Guard** — Prompts before any git push (recommended)
- **Dangerous Commands** — Prompts before destructive shell commands (recommended)
- **Protect Secrets** — Prompts before accessing sensitive files (recommended)

Default recommendation: all three.

### Step 4: Merge hooks into settings

Add the selected hooks to `settings.json` under the `hooks.PreToolUse` array. **Do not remove existing hooks** — merge alongside them.

The hook configuration to add (adjust paths to `$HOOKS_DIR`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node $HOOKS_DIR/push-guard.js"
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node $HOOKS_DIR/dangerous-commands.js"
          }
        ]
      },
      {
        "matcher": "Read|Edit|Write|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node $HOOKS_DIR/protect-secrets.js"
          }
        ]
      }
    ]
  }
}
```

Only include entries for the hooks the user selected.

### Step 5: Write settings and confirm

Write the merged `~/.claude/settings.json`. Then display a summary:

```
CAS Hooks installed:
  [x] push-guard       — prompts before git push
  [x] dangerous-commands — prompts before destructive commands
  [x] protect-secrets   — prompts before accessing secrets

Hooks use "ask" mode — Claude will prompt you for approval instead of silently blocking.
Logs: ~/.claude/hooks-logs/
```

## Important Rules

- NEVER overwrite existing hooks — always merge
- NEVER modify the hook scripts themselves during installation
- If hooks are already installed (same command path exists), skip them and tell the user
- Use absolute paths in the command field — relative paths break across projects
- If `~/.claude/settings.json` has other config (permissions, etc.), preserve it all
