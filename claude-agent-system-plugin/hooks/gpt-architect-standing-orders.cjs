#!/usr/bin/env node
"use strict";

// UserPromptSubmit hook — GPT Architect standing orders.
//
// The doctrine loaded by /gpt-architect on decays as a session grows and can
// be summarized away entirely by context compaction; a live session was
// observed implementing a whole feature inline with the mode ON because
// nothing restated the invariant mid-session. While the latest /gpt-architect
// command in the transcript is `on`, this hook re-injects a compact
// restatement of the skill's core rules on every user prompt. Mode off ->
// silent. State comes from the transcript only; no flag files.

const fs = require("fs");
const { scanSession } = require("./gpt-architect-session.cjs");

const ORDERS =
  "GPT ARCHITECT session mode is ON (latest /gpt-architect command in this session; " +
  "/gpt-architect off disables). Codex is the exclusive delegation backend: never call Agent " +
  "or launch native teammates or dynamic workflows — hooks deny them. Keep scope, " +
  "architecture, review, verification, integration, and trivial fixes in Claude; delegate " +
  "non-trivial repository inspection, implementation, testing, or focused review to the " +
  "normal codex MCP. Each call: absolute cwd; compact prompt with the concrete objective, " +
  "essential constraints, acceptance checks, and whether changes are authorized; always pass " +
  "model AND config:{\"model_reasoning_effort\":\"...\"}; sandbox read-only for " +
  "investigation/review or workspace-write for authorized edits; approval-policy on-request; " +
  "end with 'Final response: <=12 lines with changes, verification, and risks.' Routing " +
  "defaults: Spark low|medium = tiny low-risk known-surface edits (independent read-only " +
  "Terra medium review after executable Spark changes); Luna low|medium = mechanical " +
  "transformations and structured extraction; Terra medium|high = bounded implementation, " +
  "debugging, tests, focused review (default workhorse); Sol high|xhigh = architecture, " +
  "security, concurrency, performance, cross-cutting or high-risk work; ultra only for an " +
  "explicitly authorized independent-branch split. Immediately before each MCP call print " +
  "one compact status line: Codex -> <model>/<effort>: <task>. Inline product-file writes " +
  "are hook-capped per turn without a Codex call — delegation-scale implementation must go " +
  "to Codex. Review Codex diffs/tests before reporting completion.";

async function main() {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch {
    return;
  }
  if (payload?.hook_event_name !== "UserPromptSubmit") return;
  if ((await scanSession(payload?.transcript_path, payload?.cwd)).mode !== "on") return;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext: ORDERS,
      },
    }) + "\n"
  );
}

main().catch(() => process.exit(0));
