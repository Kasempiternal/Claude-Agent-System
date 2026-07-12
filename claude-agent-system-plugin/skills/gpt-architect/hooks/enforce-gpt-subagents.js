#!/usr/bin/env node
/**
 * PreToolUse hook — GPT Architect mode.
 *
 * While ~/.claude/.gpt-architect-mode exists, the native `Agent` tool is denied and
 * Claude is redirected to the Codex MCP server, so all delegated execution runs on
 * GPT-5.6 workers (billed to the ChatGPT subscription) instead of Claude subagents.
 *
 * No flag file -> this hook is inert and every Agent call passes through untouched.
 */

const fs = require("fs");
const path = require("path");

const HOME = process.env.HOME || require("os").homedir();
const FLAG = path.join(HOME, ".claude", ".gpt-architect-mode");
const SCOPE = path.join(HOME, ".claude", "gpt-architect-scope");

const allow = () => process.exit(0);

let raw = "";
try {
  raw = fs.readFileSync(0, "utf8");
} catch {
  allow();
}

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  allow();
}

// Active if: global flag, OR this session_id registered, OR cwd under a registered path.
function isActive() {
  if (fs.existsSync(FLAG)) return true;
  const sid = payload.session_id;
  if (sid && fs.existsSync(path.join(SCOPE, "sessions", sid))) return true;
  const cands = [payload.cwd, process.env.CLAUDE_PROJECT_DIR].filter(Boolean);
  try {
    for (const line of fs.readFileSync(path.join(SCOPE, "paths"), "utf8").split("\n")) {
      const d = line.trim().replace(/\/+$/, "");
      if (d && cands.some((c) => c === d || (c + "/").startsWith(d + "/"))) return true;
    }
  } catch {}
  return false;
}

if (!isActive()) allow();

if (payload.tool_name !== "Agent") allow();

const desc = payload?.tool_input?.description || "this task";

const reason = `GPT Architect mode is ON — native Claude subagents are disabled. You are the
architect: plan and review, but spend as few of your own tokens as possible.

Delegate to a GPT-5.6 worker instead, via the Codex MCP server:

  mcp__codex__codex({
    prompt:  "<self-contained task; the worker cannot see this conversation>",
    model:   "gpt-5.6-luna" | "gpt-5.6-terra" | "gpt-5.6-sol",
    config:  { "model_reasoning_effort": "low|medium|high|xhigh|max|ultra" },
    sandbox: "read-only" | "workspace-write",
    "approval-policy": "never",
    cwd:     "<absolute path>"
  })

ROUTE IN ORDER: security/race/perf/tricky refactor=sol-high; hardest coherent novel/cross-system task=sol-xhigh, with max only after xhigh fails; known multi-stage job=gpt-fleet with each node routed separately; unforeseeable dynamic >=3-part decomposition=one sol-ultra; reasoning bug/flaky hunt/PR review=terra-high; mechanical=luna-low; investigation=luna-medium; <=2-file low-risk clear change=luna-medium; all other implementation=terra-high. Implementers default high, never xhigh. Luna has no ultra; minimal/none are invalid. LATENCY: luna-medium 2-3m; terra-high 4-6m; sol-high ~8m; sol-xhigh 10-20m+. QUOTA before every batch: >=70 downgrade by default; >=90 stop; budget each sol-high at +25 points; xhigh/max/ultra one at a time. CONCURRENCY max 4; same-repo writers default 1, max 2 only with explicit non-overlapping paths; never concurrent same-file writes.

Token economy: delegate INVESTIGATION too — send a read-only luna instead of reading files
yourself. End every prompt with an output contract: "FINAL MESSAGE: <=15 lines — did / files
touched / how verified / risks; details to .gpt-worker-reports/<task>.md". Iterate on a thread
with mcp__codex__codex-reply (threadId) instead of re-briefing. Verify cheaply: git diff --stat
+ tests before reading hunks. Do NOT use the Workflow tool — it spawns Claude subagents too.

MCP codex calls serialize (one at a time, even batched). For eligible independent workers,
dispatch each via Bash run_in_background:
  \${CLAUDE_PLUGIN_ROOT}/skills/gpt-architect/bin/gpt-run -m <sol|terra|luna> -e <effort> -s <ro|ws|full> -C <abs cwd> -n <name> <<'EOF'
  <brief>
  EOF
When CLAUDE_PLUGIN_ROOT is unset, use gpt-run from PATH instead. Each task's output ends with
a summary + the worker's FINAL MESSAGE; \${CLAUDE_PLUGIN_ROOT}/skills/gpt-architect/bin/gpt-run
-r <threadId> resumes a thread (or gpt-run from PATH outside the plugin). Multi-stage
pipelines: write a JSON spec and launch \${CLAUDE_PLUGIN_ROOT}/skills/gpt-architect/bin/gpt-fleet
<spec.json> as ONE background task (or gpt-fleet from PATH outside the plugin) — workers with after:[deps] chain
automatically, {{final:NAME}} injects a predecessor's report into a prompt.

Invalid efforts: "minimal", "none" — these 400. Effort goes inside "config", not top-level.

Blocked call was: ${desc}

To turn this off: /gpt-architect off`;

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  })
);
process.exit(0);
