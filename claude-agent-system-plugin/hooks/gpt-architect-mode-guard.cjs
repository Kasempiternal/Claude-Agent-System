#!/usr/bin/env node
"use strict";

// PreToolUse guard for GPT Architect session mode (successor to
// gpt-architect-native-agent-guard.cjs). While the latest /gpt-architect
// command in this session's transcript is `on`:
//
//   - `Agent` / `Task` / `Workflow` are denied — Codex is the exclusive
//     delegation backend; those tools spawn native Claude teammates.
//   - Inline product-file writes (`Edit`/`Write`/`MultiEdit`/`NotebookEdit`)
//     are capped per turn without an intervening codex MCP call. Small review
//     fix-ups stay inline; delegation-scale implementation is denied
//     mid-streak and must go to Codex. Writes outside the product tree
//     (~/.claude, scratchpads, temp dirs, repo-local .claude/.cas) are never
//     counted or blocked.
//
// Mode off -> inert. State comes from the transcript only; no flag files.

const fs = require("fs");
const { scanSession, isProductPath, WRITE_TOOLS } = require("./gpt-architect-session.cjs");

const SPAWN_TOOLS = new Set(["Agent", "Task", "Workflow"]);

const INLINE_WRITE_LIMIT = (() => {
  const n = Number.parseInt(process.env.GPT_ARCHITECT_INLINE_WRITE_LIMIT || "", 10);
  return Number.isInteger(n) && n >= 0 ? n : 3;
})();

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }) + "\n"
  );
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch {
    return;
  }
  if (payload?.hook_event_name !== "PreToolUse") return;

  const tool = payload?.tool_name;
  const isSpawn = SPAWN_TOOLS.has(tool);
  const isWrite = WRITE_TOOLS.has(tool);
  if (!isSpawn && !isWrite) return;

  const target = isWrite
    ? payload?.tool_input?.file_path || payload?.tool_input?.notebook_path
    : null;
  if (isWrite && !isProductPath(target, payload?.cwd)) return;

  const session = await scanSession(payload?.transcript_path, payload?.cwd);
  if (session.mode !== "on") return;

  if (isSpawn) {
    deny(
      [
        "GPT Architect is ON for this session, so Codex is the exclusive delegation backend.",
        `${tool} spawns a native Claude teammate — do not launch Explore or Plan agents, Axiom agents, or dynamic workflows.`,
        "Keep architecture and review in Claude; use the normal codex MCP for delegated repository work. Independent branches get separate codex calls, or one explicitly authorized ultra split.",
        "If native teammates are truly required, ask the user to run /gpt-architect off first.",
      ].join(" ")
    );
    return;
  }

  if (session.inlineWrites < INLINE_WRITE_LIMIT) return;

  deny(
    [
      `GPT Architect is ON and this would be inline product-file write #${session.inlineWrites + 1} this turn with no Codex call — that is delegation-scale implementation, not a small review fix-up.`,
      "Delegate the remaining work to the normal codex MCP: absolute cwd; compact prompt with the concrete objective, essential constraints, acceptance checks, and whether changes are authorized; always pass model AND config:{\"model_reasoning_effort\":\"...\"}; sandbox workspace-write; approval-policy on-request; end with 'Final response: <=12 lines with changes, verification, and risks.'",
      "Routing defaults: Spark low|medium tiny known-surface edits; Luna low|medium mechanical; Terra medium|high bounded implementation/debugging/review; Sol high|xhigh architecture/security/concurrency/performance.",
      "A codex MCP call or a new user prompt resets this counter, so post-review touch-ups remain available after delegating.",
      "If the user explicitly wants Claude editing inline, ask them to run /gpt-architect off first.",
      `Blocked write: ${tool} -> ${target}`,
    ].join(" ")
  );
}

main().catch(() => process.exit(0));
