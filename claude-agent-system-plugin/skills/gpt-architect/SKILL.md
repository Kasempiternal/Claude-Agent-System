---
name: gpt-architect
description: Delegate focused implementation or investigation from Claude Code to the existing normal Codex MCP. Use when the user invokes /gpt-architect, asks Claude to hand work to Codex, or enables session-only delegation. Session mode makes Codex the exclusive delegation backend and blocks native Claude teammates. Never enables a global or persistent mode.
---

# GPT Architect

Use the connected normal `codex` MCP directly. Claude owns scope, architecture, review, and user communication; Codex performs the focused repository task.

## Session mode

- Every new session starts off. `/gpt-architect on` enables this routing for the current Claude session only; Claude then decides which non-trivial tasks benefit from delegation.
- `/gpt-architect off` disables session routing immediately. A one-shot `/gpt-architect <task>` delegates only that request and does not alter session mode.
- Session state lives only in the conversation transcript. Never create a global, project, path, or flag-file activation. The Claude status line derives `GPT-A ON` or `GPT-A OFF` from the latest explicit session command.

## Delegation invariant

- While session mode is on, Codex is the exclusive delegation backend. Never call `Agent`, launch Explore or Plan teammates, start an Axiom agent/workflow, or substitute any other native Claude subagent. Claude may still use its direct tools for quick inspection, architecture, review, verification, and integration.
- Treat deep diagnosis, extra effort, parallelism, project routing, or an agent-oriented skill as task-shaping guidance, not permission to bypass this invariant. If work has independent branches, keep one Codex call by default; use another or Ultra only under the rules below.
- If a referenced skill is missing or cannot run without native teammates, report that briefly and continue with Claude's direct tools plus Codex. Do not fall back to `Agent`.
- A user who wants native Claude teammates must run `/gpt-architect off` first. Do not infer an exception. For a one-shot `/gpt-architect <task>`, the same invariant applies until that request is complete.

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

## Select model and effort

Always pass both `model` and `config: {"model_reasoning_effort":"<effort>"}` to the Codex MCP. Do not rely on model defaults: they differ by model and may change. Honor an explicit user choice unless it is unavailable, and never silently substitute a different model or effort.

Model selects the capability, speed, and cost profile. Effort selects reasoning depth within that model:

| Model | Use it for |
| --- | --- |
| `gpt-5.3-codex-spark` | Near-instant, tightly scoped, low-risk work with named files and exact acceptance criteria. Use it for targeted iteration, not repository discovery or long-horizon execution. |
| `gpt-5.6-luna` | Clear, repeatable work with exact acceptance criteria: extraction, classification, transformation, structured summaries, or mechanical edits. |
| `gpt-5.6-terra` | Everyday repository work: bounded implementation, debugging, tests, and focused review. This is the default workhorse. |
| `gpt-5.6-sol` | Ambiguous, cross-cutting, high-value, or high-risk work requiring judgment and polish: architecture, security, concurrency, performance, or difficult multi-system changes. |

Use the lowest effort that fits the work:

| Effort | Use it when |
| --- | --- |
| `low` | The path is obvious and primarily mechanical. |
| `medium` | The task is bounded but needs ordinary planning and verification. |
| `high` | Behavior, edge cases, multiple steps, or tradeoffs require careful reasoning. |
| `xhigh` | A difficult coherent problem has interacting invariants or substantial uncertainty. |
| `max` | The hardest single problem needs depth more than speed or token economy. |
| `ultra` | Sol or Terra can split an explicitly authorized task into genuinely independent subproblems. Ultra is delegation, not a generic quality upgrade. |

Current supported combinations are `low` through `ultra` for Sol and Terra, `low` through `max` for Luna, and `low` through `xhigh` for Spark. Use these routing defaults:

- Spark `low` for an exact one-shot transformation or tiny edit; Spark `medium` for a small targeted implementation. Do not select Spark `high` or `xhigh` automatically: higher effort does not turn the smaller fast model into a frontier model.
- Luna `low` for exact mechanical transformations; Luna `medium` for structured extraction or summaries that require checking.
- Terra `medium` for clear, bounded implementation; Terra `high` for behavioral implementation, debugging, test failures, or focused review with edge cases.
- Sol `high` for architecture, security, concurrency, performance, ambiguous cross-cutting work, or other high-stakes changes.
- Sol `xhigh` when those concerns interact across systems. Use `max` only when the hardest coherent problem warrants it, not merely because a task is large.
- Use `ultra` only when the user explicitly wants parallel delegation and the work has meaningful independent branches.

### Spark fast lane

Use Spark only when all are true: the task is text-only and low-risk; the relevant file or tiny surface is already known; expected behavior is unambiguous; acceptance can be checked with a focused command; and near-instant latency materially helps. Suitable work includes granular UI iteration, a precise small edit, boilerplate or test generation from an exact specification, and a targeted question about a named file.

Never choose Spark for broad diagnosis or exploration, large refactors, unfamiliar codebase mapping, or work involving synchronization, networking reliability, authentication, permissions, security, privacy, concurrency, persistent data, schema or migrations, dependencies, build/release behavior, destructive operations, or other high-impact invariants. Route those directly to Terra or Sol. If Spark is unavailable, queued, or rejects the route, fall back once to Luna `low` for a mechanical task or Terra `medium` for code; do not retry-loop.

For every Spark prompt, name the narrow surface and explicitly require the smallest relevant validation because Spark does not run tests by default. After a Spark `workspace-write` call, Claude must inspect the diff and validation. Then make one read-only `gpt-5.6-terra`/`medium` review call unless the change is prose-only documentation/comments or an exact non-executable data transformation. Ask the reviewer for correctness, scope drift, missed edge cases, and verification gaps—not a rewrite. If it finds a substantive issue, send the correction to Terra `high` (or Sol for a high-risk discovery); do not make Spark iterate beyond its lane. Claude may resolve a truly trivial review note directly.

Escalate one effort step only when risk and complexity justify it up front or a concrete gap remains, such as a missed invariant, unresolved ambiguity, or failed verification. Refine the prompt before retrying. Change model when the task class was wrong; do not use extreme effort to compensate for the wrong model.

Immediately before the MCP call, show one compact status line: `Codex → <model>/<effort>: <task>`. This is the user's visibility into what is running. If the MCP rejects the requested combination, report that and choose a supported alternative deliberately.

## Permissions

Use `sandbox: read-only` for investigations and reviews, or `sandbox: workspace-write` when repository edits are authorized. Use `approval-policy: on-request`; never use `never` to bypass safety. Do not add a background watcher, status poller, flag file, scheduler, or menu application. Never auto-approve a command merely because Codex requested it.

Codex must never execute `rm`, `git commit`, `git commit-tree`, `git push`, or a wrapper intended to bypass those restrictions. If one is needed, Codex must stop short of it and return the exact proposed command and reason to Claude. User-level Codex execpolicy enforces this independently of the prompt.

Only Claude may execute those commands. Claude's user-level PreToolUse policy must ask the user for each matching Bash call; the skill never treats prior task authority as approval for removal, commit, or push.

For every other in-scope command, use the normal automatic tool path. Do not create an approval conversation, poll a worker, or ask the user merely because Codex ran a build, test, formatter, or read-only Git command. When Codex returns a required sensitive action, Claude reviews it and, if appropriate, invokes it once through Bash; the PreToolUse hook is the sole user approval point.

If Codex requests a consequential action outside the user's clear authority, ask the user. Otherwise let the normal MCP interaction handle permissions. Never commit, push, publish, message externally, or remove unrelated files unless the user authorized it.

## Failure

If the normal `codex` MCP is unavailable, report that directly and suggest checking `/mcp`. Do not enable another delegation framework or silently install infrastructure.
