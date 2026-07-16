---
name: gpt-architect
description: Delegate one focused implementation or investigation from Claude Code to the existing normal Codex MCP. Use when the user invokes /gpt-architect or explicitly asks Claude to hand work to Codex. This is opt-in per request and never enables a global mode.
---

# GPT Architect

Use the connected normal `codex` MCP directly. Claude owns scope, architecture, review, and user communication; Codex performs the focused repository task.

## Delegate

1. Keep trivial work in Claude. Delegate only when repository inspection, implementation, testing, or a focused review benefits from Codex.
2. Make one Codex call by default. Add another only for a genuinely independent task or a targeted follow-up.
3. Pass the absolute working directory and a compact prompt containing:
   - the concrete objective;
   - essential constraints and acceptance checks;
   - whether changes are authorized;
   - `Final response: <=12 lines with changes, verification, and risks.`
4. Let Codex inspect the repository. Do not paste large files, restate generic coding rules, request progress narration, or duplicate context already present in the workspace.
5. Review Codex's result and relevant diff/tests before reporting completion. Resolve small review issues directly; use one focused follow-up for substantive corrections.

## Permissions

Use the normal Codex sandbox and approval behavior. Do not add a background watcher, status poller, flag file, scheduler, or menu application. Never auto-approve a command merely because Codex requested it.

Codex must never execute `rm`, `git commit`, `git commit-tree`, `git push`, or a wrapper intended to bypass those restrictions. If one is needed, Codex must stop short of it and return the exact proposed command and reason to Claude. User-level Codex execpolicy enforces this independently of the prompt.

Only Claude may execute those commands. Claude's user-level PreToolUse policy must ask the user for each matching Bash call; the skill never treats prior task authority as approval for removal, commit, or push.

For every other in-scope command, use the normal automatic tool path. Do not create an approval conversation, poll a worker, or ask the user merely because Codex ran a build, test, formatter, or read-only Git command. When Codex returns a required sensitive action, Claude reviews it and, if appropriate, invokes it once through Bash; the PreToolUse hook is the sole user approval point.

If Codex requests a consequential action outside the user's clear authority, ask the user. Otherwise let the normal MCP interaction handle permissions. Never commit, push, publish, message externally, or remove unrelated files unless the user authorized it.

## Failure

If the normal `codex` MCP is unavailable, report that directly and suggest checking `/mcp`. Do not enable another delegation framework or silently install infrastructure.
