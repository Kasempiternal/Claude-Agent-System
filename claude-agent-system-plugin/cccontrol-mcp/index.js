#!/usr/bin/env node

// CCControl MCP Server
// Lightning-fast macOS app control via Accessibility APIs
// Uses cccontrol-bridge (Swift CLI) for AXUIElement operations

import { execFileSync } from "child_process";
import { existsSync } from "fs";
import { createInterface } from "readline";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BRIDGE_DIR = join(__dirname, "bridge");
const BRIDGE_BIN = join(BRIDGE_DIR, "cccontrol-bridge");
const BRIDGE_SRC = join(BRIDGE_DIR, "main.swift");

// Auto-compile bridge if binary doesn't exist
function ensureBridge() {
  if (existsSync(BRIDGE_BIN)) return;
  if (!existsSync(BRIDGE_SRC)) {
    throw new Error(
      `Bridge source not found at ${BRIDGE_SRC}. Plugin may be corrupted.`
    );
  }
  try {
    execFileSync("swiftc", [
      "-O",
      "-framework",
      "AppKit",
      "-framework",
      "ApplicationServices",
      BRIDGE_SRC,
      "-o",
      BRIDGE_BIN,
    ], { timeout: 60000 });
  } catch (e) {
    throw new Error(
      `Failed to compile cccontrol-bridge. Ensure Xcode Command Line Tools are installed: xcode-select --install\n${e.message}`
    );
  }
}

// Call bridge and parse JSON response
function bridge(args) {
  const result = execFileSync(BRIDGE_BIN, args, {
    timeout: 30000,
    maxBuffer: 50 * 1024 * 1024, // 50MB for screenshots
    encoding: "utf8",
  });
  return JSON.parse(result.trim());
}

// MCP Tool Definitions
const TOOLS = [
  {
    name: "list_apps",
    description:
      "List all running GUI applications with name, bundle ID, PID, and active status.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "launch_app",
    description:
      "Launch a macOS application by bundle ID (e.g., 'com.apple.TextEdit') and wait for it to be ready.",
    inputSchema: {
      type: "object",
      properties: {
        bundleId: {
          type: "string",
          description: "Bundle identifier (e.g., 'com.apple.TextEdit')",
        },
      },
      required: ["bundleId"],
    },
  },
  {
    name: "quit_app",
    description: "Quit a running application by bundle ID.",
    inputSchema: {
      type: "object",
      properties: {
        bundleId: {
          type: "string",
          description: "Bundle identifier of the app to quit",
        },
      },
      required: ["bundleId"],
    },
  },
  {
    name: "get_tree",
    description:
      "Get the full accessibility UI hierarchy of an app as structured JSON. This is your primary way to 'see' the app — much faster than screenshots. Returns roles, titles, identifiers, values, and state for every UI element.",
    inputSchema: {
      type: "object",
      properties: {
        app: {
          type: "string",
          description: "Bundle ID or app name",
        },
        depth: {
          type: "number",
          description: "Max tree depth (default: 5, lower = faster)",
          default: 5,
        },
      },
      required: ["app"],
    },
  },
  {
    name: "find_elements",
    description:
      "Search for UI elements matching criteria. Returns matching elements with their bounds (position/size). Use role, title, description, or identifier to filter. Faster than get_tree for targeted searches.",
    inputSchema: {
      type: "object",
      properties: {
        app: { type: "string", description: "Bundle ID or app name" },
        role: {
          type: "string",
          description:
            "AX role (e.g., AXButton, AXTextField, AXStaticText, AXCheckBox, AXPopUpButton)",
        },
        title: {
          type: "string",
          description: "Title text to match (case-insensitive partial match)",
        },
        desc: {
          type: "string",
          description:
            "Description text to match (case-insensitive partial match)",
        },
        id: {
          type: "string",
          description: "Accessibility identifier (exact match)",
        },
        max: {
          type: "number",
          description: "Maximum results (default: 20)",
          default: 20,
        },
      },
      required: ["app"],
    },
  },
  {
    name: "click",
    description:
      "Click a UI element using the accessibility AXPress action. Find the element by role, title, desc, or identifier. Use index to click the Nth match when multiple elements share the same label.",
    inputSchema: {
      type: "object",
      properties: {
        app: { type: "string", description: "Bundle ID or app name" },
        role: { type: "string", description: "AX role to match" },
        title: {
          type: "string",
          description: "Title to match (case-insensitive partial)",
        },
        desc: {
          type: "string",
          description: "Description to match (case-insensitive partial)",
        },
        id: { type: "string", description: "Accessibility identifier" },
        index: {
          type: "number",
          description:
            "0-based index when multiple elements match (e.g., index: 3 clicks the 4th match). Default: 0",
          default: 0,
        },
        path: {
          type: "array",
          description:
            'Element path for precise targeting: [{"role": "AXButton", "title": "OK"}]',
          items: { type: "object" },
        },
      },
      required: ["app"],
    },
  },
  {
    name: "click_at",
    description:
      "Click at specific screen coordinates. Use when elements lack distinguishing labels. Get coordinates from find_elements bounds (center = x + width/2, y + height/2).",
    inputSchema: {
      type: "object",
      properties: {
        app: {
          type: "string",
          description: "Bundle ID or app name (optional, activates app first)",
        },
        x: { type: "number", description: "X screen coordinate" },
        y: { type: "number", description: "Y screen coordinate" },
      },
      required: ["x", "y"],
    },
  },
  {
    name: "double_click",
    description:
      "Double-click a UI element. Useful for selecting words in text, opening files in Finder, etc.",
    inputSchema: {
      type: "object",
      properties: {
        app: { type: "string", description: "Bundle ID or app name" },
        role: { type: "string", description: "AX role to match" },
        title: { type: "string", description: "Title to match" },
        desc: { type: "string", description: "Description to match" },
        id: { type: "string", description: "Accessibility identifier" },
        index: { type: "number", description: "0-based index for Nth match", default: 0 },
      },
      required: ["app"],
    },
  },
  {
    name: "right_click",
    description:
      "Right-click a UI element to open context menus. Use find_elements after to interact with menu items.",
    inputSchema: {
      type: "object",
      properties: {
        app: { type: "string", description: "Bundle ID or app name" },
        role: { type: "string", description: "AX role to match" },
        title: { type: "string", description: "Title to match" },
        desc: { type: "string", description: "Description to match" },
        id: { type: "string", description: "Accessibility identifier" },
        index: { type: "number", description: "0-based index for Nth match", default: 0 },
      },
      required: ["app"],
    },
  },
  {
    name: "type_text",
    description:
      "Type text into the currently focused element. The app is activated first. For typing into a specific field, click it first.",
    inputSchema: {
      type: "object",
      properties: {
        app: {
          type: "string",
          description:
            "Bundle ID or app name (optional, activates app first)",
        },
        text: { type: "string", description: "Text to type" },
      },
      required: ["text"],
    },
  },
  {
    name: "shortcut",
    description:
      "Send a keyboard shortcut. Format: modifier+key (e.g., 'cmd+s', 'cmd+shift+z', 'ctrl+alt+delete').",
    inputSchema: {
      type: "object",
      properties: {
        app: {
          type: "string",
          description:
            "Bundle ID or app name (optional, activates app first)",
        },
        keys: {
          type: "string",
          description:
            "Shortcut keys (e.g., 'cmd+s', 'cmd+shift+n', 'cmd+a')",
        },
      },
      required: ["keys"],
    },
  },
  {
    name: "get_state",
    description:
      "Get current state of a specific element: value, enabled, focused, selected. Use to verify actions succeeded without taking a screenshot.",
    inputSchema: {
      type: "object",
      properties: {
        app: { type: "string", description: "Bundle ID or app name" },
        role: { type: "string", description: "AX role to match" },
        title: { type: "string", description: "Title to match" },
        desc: { type: "string", description: "Description to match" },
        id: { type: "string", description: "Accessibility identifier" },
      },
      required: ["app"],
    },
  },
  {
    name: "screenshot",
    description:
      "Capture a screenshot of an app window. Returns base64-encoded image. Use ONLY for visual evidence or when accessibility tree is insufficient (colors, layout, images). For understanding UI state, prefer get_tree.",
    inputSchema: {
      type: "object",
      properties: {
        app: {
          type: "string",
          description:
            "Bundle ID or app name (optional, captures full screen if omitted)",
        },
        format: {
          type: "string",
          enum: ["jpg", "png"],
          description: "Image format (default: jpg, smaller and faster)",
          default: "jpg",
        },
      },
      required: [],
    },
  },
  {
    name: "menu",
    description:
      "Navigate and click an app's menu bar items. Provide the menu path as comma-separated names.",
    inputSchema: {
      type: "object",
      properties: {
        app: { type: "string", description: "Bundle ID or app name" },
        path: {
          type: "string",
          description:
            "Comma-separated menu path (e.g., 'File, Save As...' or 'Edit, Find, Find...')",
        },
      },
      required: ["app", "path"],
    },
  },
  {
    name: "wait_for",
    description:
      "Wait until a UI element appears or matches a condition. Polls the accessibility tree. Use for async UI: loading states, dialogs appearing, content loading.",
    inputSchema: {
      type: "object",
      properties: {
        app: { type: "string", description: "Bundle ID or app name" },
        role: { type: "string", description: "AX role to wait for" },
        title: { type: "string", description: "Title to wait for" },
        id: { type: "string", description: "Accessibility identifier" },
        timeout: {
          type: "number",
          description: "Timeout in milliseconds (default: 5000)",
          default: 5000,
        },
      },
      required: ["app"],
    },
  },
  {
    name: "check_permission",
    description:
      "Check if accessibility permission is granted. If not, prompts the user to enable it in System Settings.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
];

// Map MCP tool calls to bridge commands
function handleToolCall(name, args) {
  switch (name) {
    case "list_apps":
      return bridge(["list-apps"]);

    case "launch_app":
      return bridge(["launch", "--app", args.bundleId]);

    case "quit_app":
      return bridge(["quit", "--app", args.bundleId]);

    case "get_tree": {
      const cmd = ["tree", "--app", args.app];
      if (args.depth) cmd.push("--depth", String(args.depth));
      return bridge(cmd);
    }

    case "find_elements": {
      const cmd = ["find", "--app", args.app];
      if (args.role) cmd.push("--role", args.role);
      if (args.title) cmd.push("--title", args.title);
      if (args.desc) cmd.push("--desc", args.desc);
      if (args.id) cmd.push("--id", args.id);
      if (args.max) cmd.push("--max", String(args.max));
      return bridge(cmd);
    }

    case "click": {
      const cmd = ["click", "--app", args.app];
      if (args.path) cmd.push("--path", JSON.stringify(args.path));
      else {
        if (args.role) cmd.push("--role", args.role);
        if (args.title) cmd.push("--title", args.title);
        if (args.desc) cmd.push("--desc", args.desc);
        if (args.id) cmd.push("--id", args.id);
        if (args.index) cmd.push("--index", String(args.index));
      }
      return bridge(cmd);
    }

    case "click_at": {
      const cmd = ["click-at", "--x", String(args.x), "--y", String(args.y)];
      if (args.app) cmd.push("--app", args.app);
      return bridge(cmd);
    }

    case "double_click": {
      const cmd = ["double-click", "--app", args.app];
      if (args.role) cmd.push("--role", args.role);
      if (args.title) cmd.push("--title", args.title);
      if (args.desc) cmd.push("--desc", args.desc);
      if (args.id) cmd.push("--id", args.id);
      if (args.index) cmd.push("--index", String(args.index));
      return bridge(cmd);
    }

    case "right_click": {
      const cmd = ["right-click", "--app", args.app];
      if (args.role) cmd.push("--role", args.role);
      if (args.title) cmd.push("--title", args.title);
      if (args.desc) cmd.push("--desc", args.desc);
      if (args.id) cmd.push("--id", args.id);
      if (args.index) cmd.push("--index", String(args.index));
      return bridge(cmd);
    }

    case "type_text": {
      const cmd = ["type", "--text", args.text];
      if (args.app) cmd.push("--app", args.app);
      return bridge(cmd);
    }

    case "shortcut": {
      const cmd = ["shortcut", "--keys", args.keys];
      if (args.app) cmd.push("--app", args.app);
      return bridge(cmd);
    }

    case "get_state": {
      const cmd = ["state", "--app", args.app];
      if (args.role) cmd.push("--role", args.role);
      if (args.title) cmd.push("--title", args.title);
      if (args.desc) cmd.push("--desc", args.desc);
      if (args.id) cmd.push("--id", args.id);
      return bridge(cmd);
    }

    case "screenshot": {
      const cmd = ["screenshot"];
      if (args.app) cmd.push("--app", args.app);
      if (args.format) cmd.push("--format", args.format);
      const result = bridge(cmd);
      return {
        _image: true,
        data: result.image,
        mimeType: args.format === "png" ? "image/png" : "image/jpeg",
      };
    }

    case "menu":
      return bridge(["menu", "--app", args.app, "--path", args.path]);

    case "wait_for": {
      const cmd = ["wait-for", "--app", args.app];
      if (args.role) cmd.push("--role", args.role);
      if (args.title) cmd.push("--title", args.title);
      if (args.id) cmd.push("--id", args.id);
      if (args.timeout) cmd.push("--timeout", String(args.timeout));
      return bridge(cmd);
    }

    case "check_permission":
      return bridge(["check-permission"]);

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// MCP JSON-RPC Server over stdio
const rl = createInterface({ input: process.stdin });

function send(msg) {
  const json = JSON.stringify(msg);
  process.stdout.write(json + "\n");
}

function sendResult(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function sendError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

// Ensure bridge is compiled on startup
try {
  ensureBridge();
} catch (e) {
  process.stderr.write(`CCControl: ${e.message}\n`);
}

rl.on("line", (line) => {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return;
  }

  const { id, method, params } = msg;

  switch (method) {
    case "initialize":
      sendResult(id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "cccontrol",
          version: "1.0.0",
        },
      });
      break;

    case "notifications/initialized":
      // No response needed
      break;

    case "tools/list":
      sendResult(id, { tools: TOOLS });
      break;

    case "tools/call": {
      const { name, arguments: args } = params;
      try {
        const result = handleToolCall(name, args || {});

        if (result && result._image) {
          sendResult(id, {
            content: [
              {
                type: "image",
                data: result.data,
                mimeType: result.mimeType,
              },
            ],
          });
        } else if (result && result.error) {
          sendResult(id, {
            content: [{ type: "text", text: `Error: ${result.error}` }],
            isError: true,
          });
        } else {
          sendResult(id, {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          });
        }
      } catch (e) {
        let errMsg = e.message;
        try {
          if (e.stderr) {
            const parsed = JSON.parse(e.stderr.toString().trim());
            if (parsed.error) errMsg = parsed.error;
          }
        } catch {
          // Use original error message
        }
        sendResult(id, {
          content: [{ type: "text", text: `Error: ${errMsg}` }],
          isError: true,
        });
      }
      break;
    }

    case "ping":
      sendResult(id, {});
      break;

    default:
      if (id) {
        sendError(id, -32601, `Method not found: ${method}`);
      }
  }
});
