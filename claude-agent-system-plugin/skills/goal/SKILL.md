---
name: goal
description: "[DEV / TESTING PHASE — UNTESTED IN A REAL CLAUDE CODE SESSION] Persistent autonomous goal pursuit. Set an objective; Claude keeps working toward it across turns until done, paused, or cleared. Codex /goal parity."
argument-hint: <objective> | pause | resume | clear | status
---

```
 ██████╗  ██████╗  █████╗ ██╗
██╔════╝ ██╔═══██╗██╔══██╗██║
██║  ███╗██║   ██║███████║██║
██║   ██║██║   ██║██╔══██║██║
╚██████╔╝╚██████╔╝██║  ██║███████╗
 ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝

  ◎ Persistent Autonomous Goal Pursuit ◎
              CAS v7.25.0
        ⚠ DEV / TESTING PHASE ⚠
```

**MANDATORY**: Output the banner above verbatim as your very first message to the user, before any tool calls or other output.

> ## ⚠ DEV / TESTING PHASE — UNTESTED IN A REAL CLAUDE CODE SESSION
>
> This skill ships a Stop hook that forces Claude to keep continuing turns until a terminal condition fires. The CLI and hook have passed local script-level smoke tests, but **no end-to-end run inside an actual Claude Code session has been performed**. Expect rough edges:
>
> - Auto-continuation may not behave as documented under real session conditions.
> - Token/transcript behavior is approximate and unverified against live transcripts.
> - Coexistence with user-side Stop hooks (e.g. `notify-stop.sh`) has not been confirmed live.
> - Edge cases (interruption, branch switches, fork/resume) are unexplored.
>
> **Before invoking on real work**: test in a throwaway project. If the loop misbehaves, run `/goal clear` or delete `.cas/goals/active.json` to disarm it. Iteration cap (default 50) and absolute ceiling (100) bound runaway loops, but the safest kill is removing the state file.
>
> Feedback / issues: https://github.com/Kasempiternal/Claude-Agent-System/issues

You are entering GOAL MODE. The user has invoked `/goal` with arguments. Parse `$ARGUMENTS`, dispatch to a deterministic CLI script, and (only on `create`) emit a directive that begins goal pursuit.

## What `/goal` does

Attaches a persistent objective to the current project. After every turn, a Stop hook (`hooks/goal-continuation.js`) automatically forces Claude to take another turn toward the objective until one of these terminal conditions:

- **Achieved** — Claude marks the goal complete by editing the state file.
- **Abandoned** — max-iter reached, or no-tool-calls livelock guard fired.
- **Cleared** — user runs `/goal clear`.
- **Paused** — user runs `/goal pause` (resumes via `/goal resume`).

This is the Claude Code analogue of codex's `/goal` feature.

## Subcommand routing

Treat the first word of `$ARGUMENTS` as the subcommand. If it matches one of `pause | resume | clear | status`, invoke that subcommand. Otherwise treat the entire `$ARGUMENTS` as the objective for `create`.

| User typed | Run |
|---|---|
| `/goal write a haiku and save it to haiku.txt` | `node "${CLAUDE_PLUGIN_ROOT}/skills/goal/scripts/goal-state.js" create "write a haiku and save it to haiku.txt"` |
| `/goal pause` | `node "${CLAUDE_PLUGIN_ROOT}/skills/goal/scripts/goal-state.js" pause` |
| `/goal resume` | `node "${CLAUDE_PLUGIN_ROOT}/skills/goal/scripts/goal-state.js" resume` |
| `/goal clear` | `node "${CLAUDE_PLUGIN_ROOT}/skills/goal/scripts/goal-state.js" clear` |
| `/goal status` | `node "${CLAUDE_PLUGIN_ROOT}/skills/goal/scripts/goal-state.js" status` |

Forward any flags (`--max-iter N`, `--yield-every N`) to `create` only.

### Steps

1. **Print the banner above.**
2. **Parse `$ARGUMENTS`** to determine subcommand and remaining args.
3. **Bash-invoke the script** with the resolved subcommand. Use the literal `${CLAUDE_PLUGIN_ROOT}` env var the harness exposes — do not substitute a hard path.
4. **Print the script's stdout to the user verbatim**. The script prints the status banner.
5. **On `create` only**: after the script returns, briefly state to the user that goal pursuit will now begin, and start working on the objective immediately. The Stop hook will keep continuing turns automatically.
6. **On any subcommand error** (script exits non-zero or prints a stderr error): show the user the error and stop. Do not begin pursuit.

## Marking completion (model-side)

When you believe the goal is complete, edit `.cas/goals/active.json` and set `status` to `"achieved"`. The next Stop hook tick will see status != active and stop forcing continuations. Append a one-line entry to `history`:

```json
{ "at": "<ISO-8601>", "event": "completed", "reason": "<what you did>" }
```

If the goal is unachievable, set `status` to `"abandoned"` and append a reason. Do **not** set status to `paused` or `cleared` — those are user-controlled (codex authority split).

## Yield window — natural pause points

By default the hook yields control back to the prompt every 5 iterations. The user sees a stderr note from the hook and can type `/goal pause | status | clear`, or any other message to continue pursuit. Yielding does NOT change goal status — it just lets the user inject a slash command without needing to interrupt mid-turn.

Power users can disable yielding with `--yield-every 0` for fully continuous pursuit until a terminal condition fires.

## Defaults

- `--max-iter` — 50 iterations
- `--yield-every` — 5 iterations

## Reference

For the full state-machine diagram, all guard clauses and their rationale, schema reference, troubleshooting, and known limitations, see `references/state-machine.md`.
