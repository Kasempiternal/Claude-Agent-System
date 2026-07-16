#!/usr/bin/env node
"use strict";

const fs = require("fs");
const readline = require("readline");

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

async function sessionMode(transcriptPath) {
  if (typeof transcriptPath !== "string" || !transcriptPath) return "off";
  try {
    await fs.promises.access(transcriptPath, fs.constants.R_OK);
  } catch {
    return "off";
  }

  let state = "off";
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
    if (event?.type !== "user" || event?.message?.role !== "user") continue;
    const command = modeCommand(event.message.content);
    if (command) state = command;
  }
  return state;
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch {
    return;
  }
  if (payload?.hook_event_name !== "PreToolUse" || payload?.tool_name !== "Agent") return;
  if ((await sessionMode(payload.transcript_path)) !== "on") return;

  const reason = [
    "GPT Architect is ON for this session, so Codex is the exclusive delegation backend.",
    "Do not launch a native Claude teammate, Explore agent, Axiom agent, or dynamic workflow.",
    "Keep architecture and review in Claude; use the normal codex MCP for delegated repository work.",
    "If native teammates are truly required, ask the user to run /gpt-architect off first.",
  ].join(" ");
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  }) + "\n");
}

main().catch(() => process.exit(0));
