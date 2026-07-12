#!/usr/bin/env node
/**
 * Pre/PostToolUse hook for mcp__codex__* — worker dispatch/report lines in the UI.
 *
 * PreToolUse:  "🚀 codex → gpt-5.6-sol (xhigh, workspace-write) · <task excerpt>"
 * PostToolUse: "🤖 gpt-5.6-sol (xhigh) · 4m46s · 316k in / 5.7k out (4.3k think) · 13 cmds · 2 edits · …064020c"
 *
 * Post stats come from the worker's rollout file (~/.codex/sessions/**),
 * located via the threadId in the MCP result — ground truth, not model memory.
 * Never blocks anything: on any parse failure it stays silent and allows.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");

function out(msg) {
  if (msg) process.stdout.write(JSON.stringify({ systemMessage: msg }));
  process.exit(0);
}

let p;
try {
  p = JSON.parse(fs.readFileSync(0, "utf8"));
} catch {
  out();
}

const k = (n) =>
  n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1000 ? Math.round(n / 1000) + "k" : String(n || 0);

const input = p.tool_input || {};

function findRolloutFiles(dir, threadId) {
  const files = [];
  const suffix = "-" + threadId + ".jsonl";
  function visit(current) {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile() && entry.name.startsWith("rollout-") && entry.name.endsWith(suffix)) {
        files.push(file);
      }
    }
  }
  visit(dir);
  return files;
}

if (p.hook_event_name === "PreToolUse") {
  const model = (input.model || "gpt-5.6-sol").replace("gpt-5.6-", "");
  const eff = (input.config || {}).model_reasoning_effort || "med";
  const sb = { "read-only": "ro", "workspace-write": "ws", "danger-full-access": "FULL" }[input.sandbox] || "ws";
  const task = (input.prompt || "").replace(/\s+/g, " ").slice(0, 70);
  const tag = p.tool_name === "mcp__codex__codex-reply"
    ? "↩ …" + String(input.threadId || "").slice(-6)
    : "🚀 " + model + " " + eff + " " + sb;
  out(tag + (task ? " · " + task : ""));
}

if (p.hook_event_name !== "PostToolUse") out();

// --- locate threadId in response or input ---
const respStr = JSON.stringify(p.tool_response || "");
const m =
  respStr.match(/"threadId"\s*:\s*"([0-9a-f-]{36})"/) ||
  respStr.match(/threadId[\\":\s]+([0-9a-f-]{36})/) ||
  [null, input.threadId];
const tid = m && m[1];
if (!tid) out();

// --- find and parse the rollout ---
let files = [];
try {
  files = findRolloutFiles(path.join(os.homedir(), ".codex", "sessions"), tid);
} catch {}
if (!files.length) out();

// Single pass; every task_started snapshots the running totals as the baseline,
// so (end - baseline) is exactly the LAST call's share — the codex-reply fix.
let model = "?", eff = "", cmds = 0, edits = 0, first = null, last = null, tok = null;
let lastRL = null, firstRL = null;
let base = { cmds: 0, edits: 0, tok: null, rl: null, t: null };
try {
  for (const line of fs.readFileSync(files[0], "utf8").split("\n")) {
    if (!line) continue;
    let d;
    try { d = JSON.parse(line); } catch { continue; }
    const pay = d.payload || {};
    if (d.timestamp) { last = d.timestamp; if (!first) first = d.timestamp; }
    if (d.type === "turn_context") {
      model = pay.model || model;
      eff = pay.effort || pay.reasoning_effort || eff;
    } else if (d.type === "response_item" &&
               (pay.type === "custom_tool_call" || pay.type === "function_call")) {
      cmds++;
    } else if (d.type === "event_msg") {
      if (pay.type === "task_started") {
        base = { cmds, edits, tok, rl: lastRL, t: d.timestamp };
      } else if (pay.type === "exec_command_begin") cmds++;
      else if (pay.type === "patch_apply_end" && pay.success !== false) edits++;
      else if (pay.type === "token_count") {
        if (pay.info) tok = pay.info.total_token_usage || tok;
        if (pay.rate_limits && pay.rate_limits.primary) {
          if (!firstRL) firstRL = pay.rate_limits;
          lastRL = pay.rate_limits;
        }
      }
    }
  }
} catch {
  out();
}

const callCmds = cmds - base.cmds;
const callEdits = edits - base.edits;
const callTok = tok
  ? (tok.total_tokens || 0) - ((base.tok && base.tok.total_tokens) || 0)
  : 0;
const t0 = base.t || first;

function quota() {
  if (!lastRL || !lastRL.primary) return null;
  const now = Math.round(lastRL.primary.used_percent);
  const baseP = base.rl ? base.rl.primary.used_percent
              : firstRL ? firstRL.primary.used_percent : null;
  const d = baseP !== null ? Math.round(lastRL.primary.used_percent - baseP) : 0;
  let reset = "";
  if (lastRL.primary.resets_at) {
    const s = Math.round(lastRL.primary.resets_at - Date.now() / 1000);
    if (s > 0) reset = " ↻" + (s >= 3600
      ? Math.floor(s / 3600) + "h" + Math.round((s % 3600) / 60) + "m"
      : Math.round(s / 60) + "m");
  }
  let str = "5h: " + (d > 0 ? "+" + d + "% → " : "") + now + "%" + reset;
  if (lastRL.secondary) str += " · wk " + Math.round(lastRL.secondary.used_percent) + "%";
  return str;
}

let dur = "";
if (t0 && last) {
  const s = Math.round((new Date(last) - new Date(t0)) / 1000);
  dur = s >= 60 ? Math.floor(s / 60) + "m" + (s % 60) + "s" : s + "s";
}
const errMark = /"isError"\s*:\s*true/.test(respStr) ? "⚠️ " : "";
const bits = [
  errMark + "🤖 " + model.replace("gpt-5.6-", "") + (eff ? " " + eff : ""),
  dur,
  callTok ? k(callTok) + " tok" : null,
  callCmds ? callCmds + " cmds" : null,
  callEdits ? callEdits + " edits" : null,
  quota(),
  "…" + tid.slice(-6),
].filter(Boolean);
out(bits.join(" · "));
