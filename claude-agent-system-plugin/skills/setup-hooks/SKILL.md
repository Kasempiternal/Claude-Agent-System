---
name: setup-hooks
description: "Verify CAS's focused safety hooks and remove obsolete duplicate installations. Use when approvals are missing, duplicated, or unexpectedly noisy."
---

# CAS Safety Hooks

Verify the current CAS hook contract. The plugin owns its hooks through `${CLAUDE_PLUGIN_ROOT}`; no version-pinned manual installation is required.

## Intended behavior

| Guard | Tool matcher | Decision |
|---|---|---|
| Secret and environment protection | `Read|Edit|Write|Bash` | Ask only when an operation could expose or alter credentials, private keys, `.env` data, or secret-bearing files and variables |
| Sensitive command approval | `Bash` | Ask for every `rm`, `git commit`, `git commit-tree`, or `git push`, including common wrappers and nested shell commands |
| GPT Architect backend guard | `Agent` | While GPT Architect is ON, deny native Claude teammates and direct delegation to Codex instead |

Ordinary builds, tests, formatters, package managers, file edits, and non-sensitive shell commands must remain automatic. The broad legacy `dangerous-commands.js` and `push-guard.js` hooks are retired and no longer ship.

## Procedure

### 1. Verify the plugin

Read `~/.claude/settings.json` and confirm `enabledPlugins["cas@claude-agent-system"]` is `true`.

If it is not enabled, stop and tell the user to run:

```text
/plugin marketplace add Kasempiternal/Claude-Agent-System
/plugin install cas
```

### 2. Verify automatic hook registration

Locate the active CAS plugin root, read `hooks/hooks.json`, and verify these commands are registered exactly once:

- `protect-secrets.js`
- `sensitive-command-approval.cjs`
- `gpt-architect-native-agent-guard.cjs`

Also verify `orchestrate-resume.js` remains the sole CAS `SessionStart` hook.

Do not add a second user-level copy of an automatic plugin hook.

### 3. Find obsolete manual entries

Inspect only `hooks.PreToolUse` entries in `~/.claude/settings.json`. Mark an entry as obsolete when its command contains any of:

- `plugins/cache/claude-agent-system/cas/`
- `push-guard.js`
- `dangerous-commands.js`
- `protect-secrets.js`
- `claude-sensitive-command-approval.cjs`
- `sensitive-command-approval.cjs`
- `gpt-architect-native-agent-guard.cjs`

These entries duplicate the current plugin-owned hooks or point at a cache version that will disappear on update.

Before changing settings, show the exact CAS entries you intend to remove and ask for confirmation. Remove only those confirmed entries. Preserve every non-CAS hook and every unrelated setting byte-for-byte where practical.

### 4. Run focused probes

Feed representative `PreToolUse` JSON directly to the installed hook scripts and verify:

- `swift test --disable-sandbox` produces no approval decision.
- `npm test` produces no approval decision.
- `rm build.tmp` returns `permissionDecision: "ask"`.
- `git commit -m "test"` returns `permissionDecision: "ask"`.
- `git push origin main` returns `permissionDecision: "ask"`.
- reading `.env` returns `permissionDecision: "ask"` from secret protection.

The probes must not execute the commands; they only pass JSON into the hook scripts.

### 5. Report

Use this compact format:

```text
CAS Safety Hooks
────────────────
✓ Secrets and environment: protected
✓ rm / git commit / git push: approval required
✓ Builds, tests, and ordinary commands: automatic
✓ GPT Architect native-agent guard: registered
Legacy duplicates: none | removed N
Logs: ~/.claude/hooks-logs/
```

If a check fails, name the exact missing or duplicate hook and the safest repair. Do not claim protection that was not verified.

## Hard rules

- Never install version-pinned cache paths.
- Never enable the broad legacy command hooks.
- Never remove non-CAS hooks.
- Never run a probe command; send it only as hook input.
- Never weaken approval for `rm`, `git commit`, or `git push`.
