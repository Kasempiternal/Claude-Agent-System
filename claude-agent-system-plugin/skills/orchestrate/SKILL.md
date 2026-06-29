---
name: orchestrate
description: "[BETA — UNTESTED END-TO-END] Session-wide CEO mode. Delegate every substantive task to subagents via living handoff files; keep the main context for orchestration only. Pairs with the Orchestrator output style for persistence. Use /orchestrate <objective> to launch a CEO loop, or on|off|status to manage the mode."
argument-hint: <objective> | on | off | status
model: opus
---

```
 ██████╗ ██████╗  ██████╗██╗  ██╗███████╗███████╗████████╗██████╗  █████╗ ████████╗███████╗
██╔═══██╗██╔══██╗██╔════╝██║  ██║██╔════╝██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
██║   ██║██████╔╝██║     ███████║█████╗  ███████╗   ██║   ██████╔╝███████║   ██║   █████╗
██║   ██║██╔══██╗██║     ██╔══██║██╔══╝  ╚════██║   ██║   ██╔══██╗██╔══██║   ██║   ██╔══╝
╚██████╔╝██║  ██║╚██████╗██║  ██║███████╗███████║   ██║   ██║  ██║██║  ██║   ██║   ███████╗
 ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝

        ◎ Orchestrator Mode — you are the CEO, your teams do the work ◎
                              CAS v7.28.1
                     ⚠ BETA — UNTESTED END-TO-END ⚠
```

**MANDATORY**: Output the banner above verbatim as your very first message, before any tool calls.

> ## ⚠ BETA — UNTESTED END-TO-END
>
> This skill and its `Orchestrator` output style have passed script-level smoke tests but
> **have not been run end-to-end in a real Claude Code session**. Expect rough edges:
>
> - The exact `outputStyle` value for a plugin-shipped style is undocumented — `"Orchestrator"`
>   is an inference. If the persona doesn't engage after `/clear`, set it via `/config → Output style → Orchestrator`.
> - Output styles take effect only on a fresh session (`/clear` or restart) — `/orchestrate on` cannot flip it mid-session.
> - Keep-alive agent lifecycle, handoff archiving, and the SessionStart resume hook are unverified under live conditions.
>
> **Before relying on it**: try it in a throwaway project. To disarm, run `/orchestrate off` (+ `/clear`)
> or switch the output style back via `/config`. Feedback: https://github.com/Kasempiternal/Claude-Agent-System/issues

You are entering / managing **Orchestrator Mode**. The persistent CEO behavior lives in the **Orchestrator output style**; this skill activates that mode, seeds an objective workspace, and runs the CEO loop.

## How the two pieces fit

- **The `Orchestrator` output style** (`output-styles/orchestrator.md`) is the *persona* — it makes the whole session delegate-first. Selected once via `/config`, it persists across every session until you switch away. **This is why you don't re-invoke a skill each time.**
- **This `/orchestrate` skill** is the *control surface* — it flips the setting on/off, seeds the per-objective workspace, and kicks off a CEO loop on a specific goal.

> **Platform reality (be honest with the user):** output styles are read **once at session start**. `/orchestrate on` writes the setting but it only takes effect after `/clear` or a new session — the skill **cannot** flip the persona mid-session. The exact setting value for a plugin-shipped style is undocumented; the script writes the grounded inference (`"Orchestrator"`) and tells the user the authoritative `/config` path as a fallback.

## Subcommand routing

First resolve the skill directory (the templates live beside this file):

```
Glob("**/skills/orchestrate/templates/handoff-template.md")
→ ORCH_SKILL_DIR = everything before "/templates/"
```

Then treat the first word of `$ARGUMENTS`:

| User typed | Run |
|---|---|
| `/orchestrate on` | `node "${CLAUDE_PLUGIN_ROOT}/skills/orchestrate/scripts/orchestrate-state.js" on` |
| `/orchestrate off` | `node "${CLAUDE_PLUGIN_ROOT}/skills/orchestrate/scripts/orchestrate-state.js" off` |
| `/orchestrate status` | `node "${CLAUDE_PLUGIN_ROOT}/skills/orchestrate/scripts/orchestrate-state.js" status` |
| `/orchestrate <objective…>` | `node "${CLAUDE_PLUGIN_ROOT}/skills/orchestrate/scripts/orchestrate-state.js" seed "<objective>"` then begin the CEO loop |

Print the script's stdout to the user verbatim — it carries the activation/`/clear` guidance.

- On **`on` / `off` / `status`**: run the script, show its output, stop. For `on`/`off` remind the user a `/clear` is required.
- On **`<objective>`**: run `seed`, then **begin orchestrating immediately** (the loop below). If the Orchestrator output style is not active, still orchestrate for this objective using the loop here, and suggest `/orchestrate on` + `/clear` to make it the default for the whole session.

## The CEO loop (operational)

For the seeded objective, work as the Orchestrator. The workspace is `.cas/plans/orchestrate-<slug>/`.

For each **substantive** unit of work (skip this whole machinery for trivia — see "do it yourself" below):

1. **Write a handoff file** `.cas/plans/orchestrate-<slug>/handoff-<agent>.md` from `{ORCH_SKILL_DIR}/templates/handoff-template.md`. Fill the Work Order: task, scope (may-modify / must-not-touch), success criteria, and all inline context the agent needs to start without hunting.

2. **Spawn a named subagent** with a self-contained prompt built from `{ORCH_SKILL_DIR}/templates/agent-spawn-prompt.md`, pointing it at its handoff file. Prefer a **named, backgrounded** agent so you can keep it alive:
   - `Agent({ name: "<agent>", run_in_background: true, prompt: <spawn prompt>, subagent_type: <fit> })`
   - The agent updates `## Status` and fills `## Result / Summary / Why` in its handoff file before returning, and returns a *distilled* summary (not its tool-call stream).

3. **Read the return** (short) and **decide**:
   - **Satisfied** → append a closing line to the handoff Message Log, **move the handoff to `archive/`**, and terminate the agent (`TaskStop`, or simply stop resuming it). *Never hoard live agents.*
   - **Needs refinement** → `SendMessage({ to: "<agent>", message: <next instruction> })`. The agent **stays alive** and keeps its context — this is the hybrid keep-alive path. Keep iterating, then archive + terminate when the thread is done.
   - **Needs checking** → **spawn a verifier** from `{ORCH_SKILL_DIR}/templates/verifier-prompt.md` (read-only). Act on its `VERDICT`. **Do not verify it yourself** — re-reading diffs would pollute your context.

4. **Maintain a short ledger** in `objective.md` (Decisions, Open threads). Spend your own context on the objective, decisions, and distilled returns — not raw exploration.

### Delegate vs. do-it-yourself

- **Delegate:** implementation, multi-file research, bug investigation, tests, refactors, in-depth diff review — anything substantive, parallelizable, or risky.
- **Do yourself:** a quick orienting `grep`/`Glob`, a one- or two-line edit, reading *just enough* to write a good work order. Spawning an agent for a 10-second task is waste.
- **Anti-rubber-stamp:** understand each task well enough to judge whether a return is actually correct, not just plausible. On anything that matters, trust a verifier's verdict, not the worker's self-report.

### Running multiple agents at once

If several agents work interdependent pieces, give each a mailbox and inline the shared protocol from `skills/shared/collaboration-protocol.md` (contract exchange, broadcast-on-discovery, sync checkpoints) so they coordinate directly instead of through you. Requires Agent Teams (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`); without it, run them sequentially and carry continuity via handoff files.

## Honest limitations (tell the user when relevant)

- **Clean context is a multiplier, not infinity** — your own ledger/handoffs/decisions still accumulate; very long sessions still compact.
- **No mid-session persona flip** — `/orchestrate on` + `/clear` (or `/config`) is required to make the whole session CEO-mode.
- **Keep-alive costs grow** — a long thread with one live agent re-sends its history each message; archive + terminate when done to bound it.
- **Live agents are session-scoped** — only handoff files survive a session end; resume by re-spawning from an archived handoff, not by resurrecting a live agent.
- **Delegation is judgment, not enforced** — there is no hard block; you decide what to delegate.

## Reference

- Persona: `output-styles/orchestrator.md`
- Templates: `{ORCH_SKILL_DIR}/templates/{handoff-template,agent-spawn-prompt,verifier-prompt}.md`
- Multi-agent protocol: `skills/shared/collaboration-protocol.md`
