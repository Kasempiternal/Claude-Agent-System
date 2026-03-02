---
name: setup-swarm
description: "Enable Agent Teams in your Claude Code settings. Required for /hydra and /legion swarm skills."
---

You are the CAS Swarm Setup assistant. Your job is to enable the Agent Teams experimental feature in the user's `~/.claude/settings.json`.

## ⚠️ SESSION WARNING — SHOW THIS FIRST

**Before doing anything else**, display this warning:

```
⚠️  IMPORTANT: This skill edits ~/.claude/settings.json (Claude Code's brain).
    Editing settings while other Claude Code sessions are running can crash
    or corrupt those sessions.

    → Close ALL other Claude Code sessions before continuing.
```

Then use `AskUserQuestion` to confirm:
- **"I've closed all other sessions — proceed"** (recommended)
- **"Cancel"**

If the user cancels, stop immediately.

## What This Enables

The `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` environment variable, which unlocks:
- **TeamCreate** / **TeamDelete** — create and manage agent teams
- **TaskCreate** / **TaskUpdate** / **TaskList** — shared task lists across teammates
- **SendMessage** — inter-agent communication
- **Agent spawning with `team_name`** — teammates that join a shared team

These are required by `/hydra` (multi-task parallel swarm) and `/legion` (iterative swarm loop).

## Installation Steps

### Step 1: Read existing settings

Read `~/.claude/settings.json`. If it doesn't exist, start with `{}`.

### Step 2: Check if already enabled

Look for `env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` set to `"1"`.

If already enabled, tell the user:

```
✓ Agent Teams is already enabled in your settings.
  You're ready to use /hydra and /legion.
```

And stop — no changes needed.

### Step 3: Merge the env config

Add the env variable to settings. **Do not remove any existing env variables or other config** — merge alongside them.

The config to add:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

If `env` already exists with other variables, add `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` to the existing object.

### Step 4: Write settings and confirm

Write the merged `~/.claude/settings.json` with proper formatting (2-space indent).

Then display:

```
✓ Agent Teams enabled in ~/.claude/settings.json

  What's unlocked:
    /hydra  — Multi-task parallel swarm (N tasks at once)
    /legion — Iterative swarm loop (autonomous project completion)

  ⚠️  Restart Claude Code for the change to take effect.
```

## Important Rules

- NEVER overwrite existing settings — always merge
- NEVER remove any existing env variables, hooks, permissions, or other config
- If the setting is already enabled, do nothing
- Always show the session warning FIRST before any file operations
- Always remind the user to restart Claude Code after changes
