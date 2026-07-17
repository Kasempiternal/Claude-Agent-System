"use strict";

// Shared GPT Architect session-state scanner. Session mode lives only in the
// conversation transcript (never a flag file): the latest explicit
// `/gpt-architect on|off` command wins. The same pass counts the assistant's
// inline product-file writes since the last user prompt or codex MCP call, so
// the mode guard can tell a small review fix-up from delegation-scale work.

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const WRITE_TOOLS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit"]);

// Paths that are orchestration overhead, not product: Claude config/memory,
// repo-local plugin state, session scratchpads, and temp dirs.
const EXEMPT_SEGMENTS = new Set([".claude", ".cas", ".gpt-worker-reports", "scratchpad"]);
const TEMP_PREFIXES = ["/tmp/", "/private/tmp/", "/var/folders/", "/private/var/folders/"];

function commandText(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((item) => item && item.type === "text" && typeof item.text === "string")
    .map((item) => item.text)
    .join("\n");
}

function modeCommand(content) {
  const text = commandText(content);
  const match = text.match(
    /^\s*<command-message>gpt-architect<\/command-message>\s*<command-name>\/gpt-architect<\/command-name>\s*<command-args>\s*(on|off)(?:\s+[^<]*)?<\/command-args>\s*$/i
  );
  return match ? match[1].toLowerCase() : null;
}

function isProductPath(filePath, cwd) {
  if (typeof filePath !== "string" || !filePath) return false;
  const resolved = path.resolve(cwd || process.cwd(), filePath);
  if (TEMP_PREFIXES.some((prefix) => (resolved + path.sep).startsWith(prefix))) return false;
  return !resolved.split(path.sep).some((segment) => EXEMPT_SEGMENTS.has(segment));
}

// A user event that starts a new turn (typed prompt or slash command), as
// opposed to a tool_result round-trip within the assistant's turn.
function isRealUserPrompt(event) {
  const content = event?.message?.content;
  if (typeof content === "string") return true;
  if (!Array.isArray(content)) return false;
  if (content.some((item) => item && item.type === "tool_result")) return false;
  return content.some((item) => item && item.type === "text");
}

async function scanSession(transcriptPath, cwd) {
  const state = { mode: "off", inlineWrites: 0 };
  if (typeof transcriptPath !== "string" || !transcriptPath) return state;
  try {
    await fs.promises.access(transcriptPath, fs.constants.R_OK);
  } catch {
    return state;
  }

  const lines = readline.createInterface({
    input: fs.createReadStream(transcriptPath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });
  for await (const line of lines) {
    if (!line) continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    if (event?.isSidechain || event?.isMeta) continue;

    if (event?.type === "user" && event?.message?.role === "user") {
      const command = modeCommand(event.message.content);
      if (command) {
        state.mode = command;
        state.inlineWrites = 0;
      } else if (isRealUserPrompt(event)) {
        state.inlineWrites = 0;
      }
      continue;
    }

    if (event?.type !== "assistant" || event?.message?.role !== "assistant") continue;
    const content = event.message.content;
    if (!Array.isArray(content)) continue;
    for (const item of content) {
      if (!item || item.type !== "tool_use" || typeof item.name !== "string") continue;
      if (item.name.startsWith("mcp__codex__")) {
        state.inlineWrites = 0;
        continue;
      }
      if (!WRITE_TOOLS.has(item.name)) continue;
      const target = item.input?.file_path || item.input?.notebook_path;
      if (isProductPath(target, cwd)) state.inlineWrites += 1;
    }
  }
  return state;
}

module.exports = { scanSession, isProductPath, WRITE_TOOLS };
