# Handoff — {AGENT_NAME}

> Living document. The Orchestrator writes the Work Order; the agent maintains Status
> and fills Result/Summary/Why; both append to the Message Log. Archived on termination.

- **Thread:** {THREAD_TITLE}
- **Spawned:** {ISO_TIMESTAMP}
- **Lifecycle:** {keep-alive | one-shot}

## Work Order
<!-- Orchestrator → agent. The task, scope, and definition of done. -->

- **Task:** {what to accomplish}
- **Scope — may modify:** {paths the agent owns}
- **Scope — read-only / must not touch:** {forbidden paths}
- **Success criteria:** {concrete, checkable}
- **Constraints / context:** {anything needed to start immediately — do NOT make the agent hunt for it}

## Status
<!-- Agent maintains. One of: IN_PROGRESS | DONE | BLOCKED -->

IN_PROGRESS

## Result / Summary / Why
<!-- Agent fills before returning. -->

- **Result:** {what was produced — files changed, findings, artifacts}
- **Summary:** {2-4 lines: what got done}
- **Why:** {reasoning, trade-offs taken, what was deliberately NOT done and why}
- **Open questions / risks:** {anything the Orchestrator should decide or verify}

## Message Log
<!-- Append-only, newest at the bottom. Format: [ISO] FROM→TO: message -->

- [{ISO_TIMESTAMP}] orchestrator→{AGENT_NAME}: {initial dispatch note, if any}
