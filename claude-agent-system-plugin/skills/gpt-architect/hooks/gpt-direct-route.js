#!/usr/bin/env node
/**
 * UserPromptSubmit hook — the "gpt:" direct lane.
 *
 * A message matching the prefix grammar below is BLOCKED before it reaches the
 * Anthropic API and routed straight to a Codex (GPT-5.6) worker on the ChatGPT
 * subscription. Escape hatch for safeguard false-positives, or any task the user
 * wants GPT to own end-to-end without Claude in the loop.
 *
 * Grammar (case-insensitive, colon required so ordinary sentences starting with
 * "gpt" pass through untouched):
 *   gpt: <task>                          -> sol + high, workspace-write
 *   gpt <model>: <task>                  -> model = luna | terra | sol
 *   gpt <model> <effort>: <task>         -> effort = low|medium|high|xhigh|max|ultra
 *   gpt <model> <effort> full: <task>    -> danger-full-access sandbox (network, ssh)
 *
 * Results land in ~/.claude/gpt-direct/<ts>-<slug>.result.md ; a macOS
 * notification fires on completion. GPT_DIRECT_DRY=1 prints parsing instead of
 * spawning (debug aid).
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

function isExecutable(file) {
  try {
    fs.accessSync(file, fs.constants.X_OK);
    return fs.statSync(file).isFile();
  } catch {
    return false;
  }
}

const CODEX = (() => {
  if (process.env.CODEX_BIN) return isExecutable(process.env.CODEX_BIN) ? process.env.CODEX_BIN : null;
  const pathEntries = (process.env.PATH || "").split(path.delimiter);
  const discovered = pathEntries.map((dir) => path.join(dir, "codex")).find(isExecutable);
  return discovered || (isExecutable("/opt/homebrew/bin/codex") ? "/opt/homebrew/bin/codex" : null);
})();

function allow() { process.exit(0); }

let payload;
try {
  payload = JSON.parse(fs.readFileSync(0, "utf8"));
} catch {
  allow();
}

const prompt = (payload && payload.prompt) || "";
const m = prompt.match(
  /^\s*gpt(?:\s+(luna|terra|sol))?(?:\s+(low|medium|high|xhigh|max|ultra))?(?:\s+(full))?\s*:\s*([\s\S]+)$/i
);
if (!m) allow();

// A direct prompt must only be blocked after a runnable worker has been identified.
if (!CODEX) allow();

const model = "gpt-5.6-" + (m[1] || "sol").toLowerCase();
let effort = (m[2] || "high").toLowerCase();
if (model === "gpt-5.6-luna" && effort === "ultra") effort = "max"; // luna has no ultra
const sandbox = m[3] ? "danger-full-access" : "workspace-write";
const task = m[4].trim();
const cwd = (payload && payload.cwd) || process.cwd();

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: "block", reason }));
  process.exit(0);
}

if (process.env.GPT_DIRECT_DRY) {
  block("DRY RUN — model=" + model + " effort=" + effort + " sandbox=" + sandbox +
        " cwd=" + cwd + " task=" + task.slice(0, 60));
}

const dir = path.join(os.homedir(), ".claude", "gpt-direct");
fs.mkdirSync(dir, { recursive: true });
const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const slug =
  task.slice(0, 40).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "task";
const base = path.join(dir, ts + "-" + slug);
const promptFile = base + ".prompt.md";
const outFile = base + ".result.md";
const logFile = base + ".log";

fs.writeFileSync(
  promptFile,
  task +
    "\n\nFINAL MESSAGE FORMAT: <=25 lines — what you did/found, files touched, how you verified, open risks."
);

const q = (s) => "'" + String(s).replace(/'/g, "'\\''") + "'";
const sh =
  q(CODEX) + " exec --skip-git-repo-check" +
  " -C " + q(cwd) +
  " -m " + q(model) +
  " -c model_reasoning_effort=" + q(effort) +
  " --sandbox " + q(sandbox) +
  " -o " + q(outFile) +
  " - < " + q(promptFile) + " > " + q(logFile) + " 2>&1; " +
  "/usr/bin/osascript -e " +
  q('display notification "' + slug + '" with title "GPT-5.6 worker finished" sound name "Glass"');

spawn("/bin/sh", ["-c", sh], { detached: true, stdio: "ignore" }).unref();

block(
  "Routed straight to " + model + " (effort=" + effort + ", sandbox=" + sandbox + ") — " +
    "this message was blocked before reaching the Anthropic API; no safeguard can flag it.\n" +
    "  result  → " + outFile + "\n" +
    "  live log → tail -f " + logFile + "\n" +
    "macOS notification fires when done. To have Claude integrate it, ask: read " + outFile
);
