#!/usr/bin/env node
import {
  CHROME_FLAGS,
  DEFAULT_BROWSER_CONFIG,
  DEFAULT_TIMEOUT,
  DEVICE_PRESETS,
  HEALTH_CHECK_INTERVAL,
  NAVIGATION_TIMEOUT
} from "./chunk-EAOU7X3D.js";

// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// src/tools/browser.ts
import { z } from "zod";

// src/browser/launcher.ts
import * as chromeLauncher from "chrome-launcher";
var activeBrowser = null;
async function launchBrowser(config) {
  if (activeBrowser) {
    return activeBrowser;
  }
  const mergedConfig = { ...DEFAULT_BROWSER_CONFIG, ...config };
  const chromeFlags = [...CHROME_FLAGS];
  if (mergedConfig.headless) {
    chromeFlags.push("--headless=new");
  }
  const viewport = mergedConfig.viewport;
  chromeFlags.push(`--window-size=${viewport.width},${viewport.height}`);
  if (mergedConfig.userAgent) {
    chromeFlags.push(`--user-agent=${mergedConfig.userAgent}`);
  }
  if (mergedConfig.locale) {
    chromeFlags.push(`--lang=${mergedConfig.locale}`);
  }
  if (mergedConfig.timezone) {
    chromeFlags.push(`--timezone=${mergedConfig.timezone}`);
  }
  const chrome = await chromeLauncher.launch({
    chromeFlags,
    port: 0
    // Random available port
  });
  activeBrowser = {
    process: chrome,
    port: chrome.port,
    pid: chrome.pid
  };
  return activeBrowser;
}
async function closeBrowser() {
  if (activeBrowser) {
    await activeBrowser.process.kill();
    activeBrowser = null;
  }
}
function getActiveBrowser() {
  return activeBrowser;
}
async function getBrowserStatus() {
  if (!activeBrowser) {
    return { running: false };
  }
  try {
    process.kill(activeBrowser.pid, 0);
    return {
      running: true,
      port: activeBrowser.port,
      pid: activeBrowser.pid
    };
  } catch {
    activeBrowser = null;
    return { running: false };
  }
}

// src/browser/health.ts
var healthInterval = null;
function startHealthMonitor(pool2) {
  if (healthInterval) return;
  healthInterval = setInterval(async () => {
    const browser = getActiveBrowser();
    if (!browser) {
      stopHealthMonitor();
      return;
    }
    try {
      process.kill(browser.pid, 0);
    } catch {
      console.error("[spectra] Chrome process died, cleaning up...");
      await pool2.disconnectAll();
      await closeBrowser();
      stopHealthMonitor();
    }
  }, HEALTH_CHECK_INTERVAL);
}
function stopHealthMonitor() {
  if (healthInterval) {
    clearInterval(healthInterval);
    healthInterval = null;
  }
}

// src/tools/browser.ts
function registerBrowserTools(server2, getPool2, setPool2) {
  server2.tool(
    "spectra_launch_browser",
    "Launch headless Chrome browser. Auto-downloads Chrome if needed. Returns connection info.",
    {
      headless: z.boolean().optional().describe("Run in headless mode (default: true)"),
      width: z.number().optional().describe("Viewport width (default: 1280)"),
      height: z.number().optional().describe("Viewport height (default: 720)"),
      userAgent: z.string().optional().describe("Custom user agent string"),
      locale: z.string().optional().describe("Browser locale (e.g., 'en-US')"),
      timezone: z.string().optional().describe("Timezone (e.g., 'America/New_York')")
    },
    async ({ headless, width, height, userAgent, locale, timezone }) => {
      try {
        const viewport = {
          width: width ?? DEFAULT_BROWSER_CONFIG.viewport.width,
          height: height ?? DEFAULT_BROWSER_CONFIG.viewport.height
        };
        const browser = await launchBrowser({
          headless: headless ?? DEFAULT_BROWSER_CONFIG.headless,
          viewport,
          userAgent,
          locale,
          timezone
        });
        const { CDPPool } = await import("./pool-KDQLUEJA.js");
        const pool2 = new CDPPool(browser.port);
        setPool2(pool2);
        const targets = await pool2.listTargets();
        if (targets.length > 0) {
          await pool2.connectToTab(targets[0].id);
        }
        startHealthMonitor(pool2);
        return {
          content: [
            {
              type: "text",
              text: `Browser launched successfully.
- Port: ${browser.port}
- PID: ${browser.pid}
- Headless: ${headless ?? DEFAULT_BROWSER_CONFIG.headless}
- Viewport: ${viewport.width}x${viewport.height}
- Tabs: ${targets.length}
- Active tab: ${targets[0]?.id || "none"}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Failed to launch browser: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_close_browser",
    "Close the browser and clean up all connections.",
    {},
    async () => {
      try {
        const pool2 = getPool2();
        if (pool2) {
          await pool2.disconnectAll();
        }
        stopHealthMonitor();
        await closeBrowser();
        setPool2(null);
        return {
          content: [{ type: "text", text: "Browser closed successfully." }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Failed to close browser: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_browser_status",
    "Get browser health status: running state, port, PID, open tabs, memory usage.",
    {},
    async () => {
      try {
        const status = await getBrowserStatus();
        const pool2 = getPool2();
        let tabInfo = "No tabs";
        if (status.running && pool2) {
          const targets = await pool2.listTargets();
          const activeId = pool2.getActiveTabId();
          tabInfo = targets.map(
            (t) => `${t.id === activeId ? "\u2192 " : "  "}${t.id}: ${t.url} (${t.title})`
          ).join("\n");
        }
        return {
          content: [
            {
              type: "text",
              text: `Browser Status:
- Running: ${status.running}
- Port: ${status.port || "N/A"}
- PID: ${status.pid || "N/A"}

Tabs:
${tabInfo}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Failed to get status: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_set_viewport",
    "Resize the browser viewport for the active tab.",
    {
      width: z.number().describe("Viewport width in pixels"),
      height: z.number().describe("Viewport height in pixels"),
      deviceScaleFactor: z.number().optional().describe("Device scale factor (default: 1)"),
      isMobile: z.boolean().optional().describe("Emulate mobile device (default: false)")
    },
    async ({ width, height, deviceScaleFactor, isMobile }) => {
      try {
        const pool2 = getPool2();
        if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
        const conn = await pool2.getActiveConnection();
        await conn.client.Emulation.setDeviceMetricsOverride({
          width,
          height,
          deviceScaleFactor: deviceScaleFactor ?? 1,
          mobile: isMobile ?? false
        });
        return {
          content: [
            {
              type: "text",
              text: `Viewport set to ${width}x${height} (scale: ${deviceScaleFactor ?? 1}, mobile: ${isMobile ?? false})`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Failed to set viewport: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_emulate_device",
    `Emulate a device preset. Available: ${Object.keys(DEVICE_PRESETS).join(", ")}`,
    {
      device: z.string().describe(`Device preset name: ${Object.keys(DEVICE_PRESETS).join(", ")}`)
    },
    async ({ device }) => {
      try {
        const pool2 = getPool2();
        if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
        const preset = DEVICE_PRESETS[device];
        if (!preset) {
          return {
            content: [
              {
                type: "text",
                text: `Unknown device "${device}". Available: ${Object.keys(DEVICE_PRESETS).join(", ")}`
              }
            ],
            isError: true
          };
        }
        const conn = await pool2.getActiveConnection();
        await conn.client.Emulation.setDeviceMetricsOverride({
          width: preset.viewport.width,
          height: preset.viewport.height,
          deviceScaleFactor: preset.deviceScaleFactor,
          mobile: preset.isMobile
        });
        if (preset.userAgent) {
          await conn.client.Emulation.setUserAgentOverride({
            userAgent: preset.userAgent
          });
        }
        return {
          content: [
            {
              type: "text",
              text: `Emulating ${preset.name}: ${preset.viewport.width}x${preset.viewport.height} (scale: ${preset.deviceScaleFactor}, mobile: ${preset.isMobile})`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Failed to emulate device: ${error}` }],
          isError: true
        };
      }
    }
  );
}

// src/tools/navigation.ts
import { z as z2 } from "zod";
function registerNavigationTools(server2, getPool2) {
  const requirePool = () => {
    const pool2 = getPool2();
    if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool2;
  };
  server2.tool(
    "spectra_navigate",
    "Navigate to a URL. Waits for the page to load.",
    {
      url: z2.string().describe("URL to navigate to"),
      waitUntil: z2.enum(["load", "domcontentloaded", "networkidle"]).optional().describe("Wait condition (default: load)"),
      timeout: z2.number().optional().describe("Timeout in ms (default: 60000)")
    },
    async ({ url, waitUntil, timeout }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const waitEvent = waitUntil || "load";
        const timeoutMs = timeout || NAVIGATION_TIMEOUT;
        const waitPromise = waitEvent === "domcontentloaded" ? client.Page.domContentEventFired() : waitEvent === "networkidle" ? waitForNetworkIdle(client, timeoutMs) : client.Page.loadEventFired();
        await client.Page.navigate({ url });
        await Promise.race([
          waitPromise,
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error("Navigation timeout")), timeoutMs)
          )
        ]);
        const { result: titleResult } = await client.Runtime.evaluate({
          expression: "document.title",
          returnByValue: true
        });
        const { result: urlResult } = await client.Runtime.evaluate({
          expression: "window.location.href",
          returnByValue: true
        });
        return {
          content: [
            {
              type: "text",
              text: `Navigated to: ${urlResult.value}
Title: ${titleResult.value}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Navigation failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_go_back",
    "Navigate back in browser history.",
    {},
    async () => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const { currentIndex, entries } = await conn.client.Page.getNavigationHistory();
        if (currentIndex > 0) {
          await conn.client.Page.navigateToHistoryEntry({
            entryId: entries[currentIndex - 1].id
          });
          await conn.client.Page.loadEventFired();
        }
        const { result } = await conn.client.Runtime.evaluate({
          expression: "window.location.href",
          returnByValue: true
        });
        return {
          content: [{ type: "text", text: `Navigated back to: ${result.value}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Go back failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_go_forward",
    "Navigate forward in browser history.",
    {},
    async () => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const { currentIndex, entries } = await conn.client.Page.getNavigationHistory();
        if (currentIndex < entries.length - 1) {
          await conn.client.Page.navigateToHistoryEntry({
            entryId: entries[currentIndex + 1].id
          });
          await conn.client.Page.loadEventFired();
        }
        const { result } = await conn.client.Runtime.evaluate({
          expression: "window.location.href",
          returnByValue: true
        });
        return {
          content: [{ type: "text", text: `Navigated forward to: ${result.value}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Go forward failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_reload",
    "Reload the current page.",
    {
      ignoreCache: z2.boolean().optional().describe("Bypass cache on reload (default: false)")
    },
    async ({ ignoreCache }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        await conn.client.Page.reload({
          ignoreCache: ignoreCache ?? false
        });
        await conn.client.Page.loadEventFired();
        const { result } = await conn.client.Runtime.evaluate({
          expression: "document.title",
          returnByValue: true
        });
        return {
          content: [{ type: "text", text: `Page reloaded. Title: ${result.value}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Reload failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_wait_for",
    "Wait for a condition: CSS selector visible, text appears, URL matches, or network idle.",
    {
      condition: z2.enum(["selector", "text", "url", "networkIdle"]).describe("What to wait for"),
      value: z2.string().optional().describe("Selector, text, or URL pattern to wait for"),
      timeout: z2.number().optional().describe("Timeout in ms (default: 30000)")
    },
    async ({ condition, value, timeout }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const timeoutMs = timeout || DEFAULT_TIMEOUT;
        const start = Date.now();
        switch (condition) {
          case "selector": {
            if (!value) throw new Error("'value' required for selector condition");
            await pollUntil(
              async () => {
                const { result } = await client.Runtime.evaluate({
                  expression: `!!document.querySelector('${value.replace(/'/g, "\\'")}')`,
                  returnByValue: true
                });
                return result.value === true;
              },
              timeoutMs
            );
            break;
          }
          case "text": {
            if (!value) throw new Error("'value' required for text condition");
            await pollUntil(
              async () => {
                const { result } = await client.Runtime.evaluate({
                  expression: `document.body.innerText.includes(${JSON.stringify(value)})`,
                  returnByValue: true
                });
                return result.value === true;
              },
              timeoutMs
            );
            break;
          }
          case "url": {
            if (!value) throw new Error("'value' required for url condition");
            await pollUntil(
              async () => {
                const { result } = await client.Runtime.evaluate({
                  expression: "window.location.href",
                  returnByValue: true
                });
                const re = new RegExp(value);
                return re.test(String(result.value));
              },
              timeoutMs
            );
            break;
          }
          case "networkIdle": {
            await waitForNetworkIdle(client, timeoutMs);
            break;
          }
        }
        const elapsed = Date.now() - start;
        return {
          content: [
            {
              type: "text",
              text: `Condition "${condition}" met in ${elapsed}ms.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Wait failed: ${error}` }],
          isError: true
        };
      }
    }
  );
}
async function waitForNetworkIdle(client, timeout) {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(), 2e3);
    setTimeout(() => {
      clearTimeout(timer);
      reject(new Error("Network idle timeout"));
    }, timeout);
  });
}
async function pollUntil(fn, timeout, interval = 100) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await fn()) return;
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}

// src/tools/inspection.ts
import { z as z3 } from "zod";

// src/state/serializer.ts
function serializeAXTree(nodes, indent = 0) {
  const lines = [];
  for (const node of nodes) {
    if (node.ignored) continue;
    if (shouldSkip(node)) continue;
    const line = formatNode(node, indent);
    if (line) lines.push(line);
    if (node.children && node.children.length > 0) {
      const childText = serializeAXTree(node.children, indent + 1);
      if (childText) lines.push(childText);
    }
  }
  return lines.join("\n");
}
function formatNode(node, indent) {
  const pad = "  ".repeat(indent);
  const role = node.role.toLowerCase();
  const name = node.name?.trim();
  if (isGenericContainer(role) && !name) return "";
  let line = `${pad}[${role}`;
  const props = formatProperties(node);
  if (props) line += ` ${props}`;
  line += "]";
  if (name) {
    line += ` "${truncate(name, 100)}"`;
  }
  if (node.value && node.value !== name) {
    line += ` value="${truncate(String(node.value), 80)}"`;
  }
  return line;
}
function formatProperties(node) {
  const parts = [];
  const props = node.properties || {};
  if (props.level) parts.push(`level=${props.level}`);
  if (props.checked !== void 0) parts.push(`checked=${props.checked}`);
  if (props.selected) parts.push("selected");
  if (props.expanded !== void 0) parts.push(`expanded=${props.expanded}`);
  if (props.disabled) parts.push("disabled");
  if (props.required) parts.push("required");
  if (props.readonly) parts.push("readonly");
  if (props.url) parts.push(`-> ${truncate(String(props.url), 60)}`);
  return parts.join(" ");
}
function isGenericContainer(role) {
  return [
    "generic",
    "none",
    "presentation",
    "group",
    "div",
    "span"
  ].includes(role);
}
function shouldSkip(node) {
  const role = node.role.toLowerCase();
  return ["ignorable", "inlinecontent"].includes(role);
}
function truncate(s, max) {
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + "...";
}
function parseAXNodes(rawNodes) {
  const nodeMap = /* @__PURE__ */ new Map();
  const roots = [];
  for (const raw of rawNodes) {
    const nodeId = String(raw.nodeId ?? "");
    const role = extractAXValue(raw.role);
    const name = extractAXValue(raw.name);
    const value = extractAXValue(raw.value);
    const description = extractAXValue(raw.description);
    const ignored = Boolean(raw.ignored);
    const properties = {};
    if (Array.isArray(raw.properties)) {
      for (const prop of raw.properties) {
        properties[prop.name] = prop.value?.value;
      }
    }
    const node = {
      nodeId,
      role,
      name,
      value,
      description,
      properties,
      children: [],
      ignored
    };
    nodeMap.set(nodeId, node);
    const childIds = raw.childIds;
    if (!childIds || childIds.length === 0) {
    }
  }
  for (const raw of rawNodes) {
    const nodeId = String(raw.nodeId ?? "");
    const parent = nodeMap.get(nodeId);
    if (!parent) continue;
    const childIds = raw.childIds;
    if (childIds) {
      for (const childId of childIds) {
        const child = nodeMap.get(childId);
        if (child) {
          parent.children.push(child);
        }
      }
    }
    const parentId = raw.parentId;
    if (!parentId || !nodeMap.has(parentId)) {
      roots.push(parent);
    }
  }
  if (roots.length === 0 && nodeMap.size > 0) {
    roots.push(nodeMap.values().next().value);
  }
  return roots;
}
function extractAXValue(raw) {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null) {
    const obj = raw;
    return String(obj.value ?? obj.type ?? "");
  }
  return String(raw);
}

// src/state/store.ts
var StateStore = class {
  snapshots = /* @__PURE__ */ new Map();
  setSnapshot(tabId, nodes, text) {
    this.snapshots.set(tabId, { nodes, text, timestamp: Date.now() });
  }
  getLastSnapshot(tabId) {
    return this.snapshots.get(tabId);
  }
  clearSnapshot(tabId) {
    this.snapshots.delete(tabId);
  }
  clear() {
    this.snapshots.clear();
  }
};
var stateStore = new StateStore();

// src/utils/selectors.ts
async function resolveTarget(client, target) {
  if (looksLikeCSS(target)) {
    const result = await resolveCSS(client, target);
    if (result) return result;
  }
  if (target.startsWith("/") || target.startsWith("(")) {
    const result = await resolveXPath(client, target);
    if (result) return result;
  }
  const coords = parseCoords(target);
  if (coords) {
    return {
      nodeId: 0,
      backendNodeId: 0,
      boundingBox: { x: coords.x, y: coords.y, width: 1, height: 1 }
    };
  }
  const axResult = await resolveByAccessibilityName(client, target);
  if (axResult) return axResult;
  const cssResult = await resolveCSS(client, target);
  if (cssResult) return cssResult;
  throw new Error(
    `Could not find element matching "${target}". Tried: accessibility name, CSS selector, XPath.`
  );
}
async function resolveCSS(client, selector) {
  try {
    const { root } = await client.DOM.getDocument({ depth: 0 });
    const { nodeId } = await client.DOM.querySelector({
      nodeId: root.nodeId,
      selector
    });
    if (!nodeId) return null;
    return await buildResolvedElement(client, nodeId);
  } catch {
    return null;
  }
}
async function resolveXPath(client, expression) {
  try {
    const { result } = await client.Runtime.evaluate({
      expression: `document.evaluate('${expression.replace(/'/g, "\\'")}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`,
      returnByValue: false
    });
    if (!result.objectId) return null;
    const { node } = await client.DOM.describeNode({
      objectId: result.objectId
    });
    return await buildResolvedElement(client, node.nodeId, node.backendNodeId);
  } catch {
    return null;
  }
}
async function resolveByAccessibilityName(client, name) {
  try {
    const { result } = await client.Runtime.evaluate({
      expression: `
        (function() {
          const target = ${JSON.stringify(name)};
          const lower = target.toLowerCase();

          // Try aria-label match
          let el = document.querySelector('[aria-label="' + target.replace(/"/g, '\\\\"') + '"]');
          if (el) return el;

          // Try exact text content match on interactive elements
          const interactive = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"], [role="tab"], [role="menuitem"]');
          for (const e of interactive) {
            if (e.textContent?.trim() === target) return e;
          }

          // Try case-insensitive text match
          for (const e of interactive) {
            if (e.textContent?.trim().toLowerCase() === lower) return e;
          }

          // Try contains match on interactive elements
          for (const e of interactive) {
            if (e.textContent?.trim().toLowerCase().includes(lower)) return e;
          }

          // Try placeholder match
          el = document.querySelector('[placeholder="' + target.replace(/"/g, '\\\\"') + '"]');
          if (el) return el;

          // Try any element with matching text
          const all = document.querySelectorAll('*');
          for (const e of all) {
            if (e.children.length === 0 && e.textContent?.trim() === target) return e;
          }

          return null;
        })()
      `,
      returnByValue: false
    });
    if (!result.objectId) return null;
    const { node } = await client.DOM.describeNode({
      objectId: result.objectId
    });
    return await buildResolvedElement(client, node.nodeId, node.backendNodeId);
  } catch {
    return null;
  }
}
async function buildResolvedElement(client, nodeId, backendNodeId) {
  let bnid = backendNodeId;
  if (!bnid) {
    const { node } = await client.DOM.describeNode({ nodeId });
    bnid = node.backendNodeId;
  }
  let boundingBox = { x: 0, y: 0, width: 0, height: 0 };
  try {
    const { model } = await client.DOM.getBoxModel({ nodeId });
    if (model?.content) {
      const [x1, y1, x2, , , y3] = model.content;
      boundingBox = {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y3 - y1
      };
    }
  } catch {
  }
  return {
    nodeId,
    backendNodeId: bnid,
    boundingBox
  };
}
function looksLikeCSS(s) {
  return s.startsWith("#") || s.startsWith(".") || s.startsWith("[") || s.includes(">") || s.includes("~") || s.includes("+") || /^[a-z]+(\[|#|\.|:)/.test(s) || /^[a-z]+$/.test(s);
}
function parseCoords(s) {
  try {
    const obj = JSON.parse(s);
    if (typeof obj.x === "number" && typeof obj.y === "number") {
      return { x: obj.x, y: obj.y };
    }
  } catch {
  }
  const match = s.match(/^(\d+)\s*,\s*(\d+)$/);
  if (match) {
    return { x: Number(match[1]), y: Number(match[2]) };
  }
  return null;
}

// src/tools/inspection.ts
function registerInspectionTools(server2, getPool2) {
  const requirePool = () => {
    const pool2 = getPool2();
    if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool2;
  };
  server2.tool(
    "spectra_get_snapshot",
    "Get LLM-friendly accessibility tree snapshot of the page. Use diffOnly=true after interactions to see only what changed (~50 tokens vs ~2000).",
    {
      diffOnly: z3.boolean().optional().describe("Return only changes since last snapshot (default: false)"),
      depth: z3.number().optional().describe("Max tree depth (default: unlimited)"),
      includeHidden: z3.boolean().optional().describe("Include hidden elements (default: false)")
    },
    async ({ diffOnly, depth, includeHidden }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const tabId = pool2.getActiveTabId();
        await pool2.ensureDomain("Accessibility", tabId);
        const [titleRes, urlRes] = await Promise.all([
          client.Runtime.evaluate({ expression: "document.title", returnByValue: true }),
          client.Runtime.evaluate({ expression: "window.location.href", returnByValue: true })
        ]);
        const { nodes: rawNodes } = await client.Accessibility.getFullAXTree({
          depth: depth ?? -1
        });
        const axNodes = parseAXNodes(rawNodes);
        const text = serializeAXTree(axNodes);
        stateStore.setSnapshot(tabId, axNodes, text);
        if (diffOnly) {
          const last = stateStore.getLastSnapshot(tabId);
          if (last && last.text !== text) {
            return {
              content: [
                {
                  type: "text",
                  text: `# Page: ${titleRes.result.value} (${urlRes.result.value})
# [DIFF MODE \u2014 showing full snapshot, structural diff coming in Phase 4]

${text}`
                }
              ]
            };
          }
        }
        const header = `# Page: ${titleRes.result.value} (${urlRes.result.value})
# ${axNodes.length} nodes
`;
        return {
          content: [{ type: "text", text: header + "\n" + text }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Snapshot failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_get_element",
    "Get detailed info about a single element: properties, styles, bounding box, event listeners.",
    {
      target: z3.string().describe("Element selector (CSS, XPath, accessibility name, or coordinates)")
    },
    async ({ target }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const element = await resolveTarget(client, target);
        const { node } = await client.DOM.describeNode({
          nodeId: element.nodeId,
          depth: 1
        });
        const { computedStyle } = await client.CSS.getComputedStyleForNode({
          nodeId: element.nodeId
        });
        const styles = computedStyle.filter(
          (s) => ["display", "visibility", "opacity", "color", "background-color", "font-size", "font-weight", "position", "width", "height"].includes(s.name)
        ).map((s) => `${s.name}: ${s.value}`).join(", ");
        const attrs = (node.attributes || []).reduce((acc, _, i, arr) => {
          if (i % 2 === 0) acc[arr[i]] = arr[i + 1];
          return acc;
        }, {});
        const info = [
          `Tag: <${node.nodeName.toLowerCase()}>`,
          `NodeId: ${element.nodeId}`,
          `Bounding box: x=${element.boundingBox.x}, y=${element.boundingBox.y}, w=${element.boundingBox.width}, h=${element.boundingBox.height}`,
          Object.keys(attrs).length > 0 ? `Attributes: ${JSON.stringify(attrs)}` : null,
          styles ? `Styles: ${styles}` : null,
          node.childNodeCount !== void 0 ? `Children: ${node.childNodeCount}` : null
        ].filter(Boolean).join("\n");
        return {
          content: [{ type: "text", text: info }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Get element failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_query_elements",
    "Find multiple elements by CSS selector, role, or text content. Returns a summary list.",
    {
      selector: z3.string().optional().describe("CSS selector to match"),
      role: z3.string().optional().describe("ARIA role to match"),
      text: z3.string().optional().describe("Text content to match (partial)"),
      limit: z3.number().optional().describe("Max results (default: 20)")
    },
    async ({ selector, role, text, limit }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const max = limit || 20;
        let expression;
        if (selector) {
          expression = `
            Array.from(document.querySelectorAll(${JSON.stringify(selector)}))
              .slice(0, ${max})
              .map((el, i) => ({
                index: i,
                tag: el.tagName.toLowerCase(),
                id: el.id || null,
                className: el.className || null,
                text: el.textContent?.trim().slice(0, 100) || null,
                role: el.getAttribute('role') || null,
                ariaLabel: el.getAttribute('aria-label') || null,
                visible: el.offsetParent !== null || el.tagName === 'BODY',
              }))
          `;
        } else if (role) {
          expression = `
            Array.from(document.querySelectorAll('[role="${role}"]'))
              .slice(0, ${max})
              .map((el, i) => ({
                index: i,
                tag: el.tagName.toLowerCase(),
                id: el.id || null,
                text: el.textContent?.trim().slice(0, 100) || null,
                ariaLabel: el.getAttribute('aria-label') || null,
                visible: el.offsetParent !== null,
              }))
          `;
        } else if (text) {
          expression = `
            (function() {
              const target = ${JSON.stringify(text)}.toLowerCase();
              return Array.from(document.querySelectorAll('*'))
                .filter(el => el.children.length === 0 && el.textContent?.toLowerCase().includes(target))
                .slice(0, ${max})
                .map((el, i) => ({
                  index: i,
                  tag: el.tagName.toLowerCase(),
                  id: el.id || null,
                  text: el.textContent?.trim().slice(0, 100) || null,
                  role: el.getAttribute('role') || null,
                  visible: el.offsetParent !== null,
                }));
            })()
          `;
        } else {
          throw new Error("Provide at least one of: selector, role, or text");
        }
        const { result } = await client.Runtime.evaluate({
          expression,
          returnByValue: true
        });
        const elements = result.value;
        if (!elements || elements.length === 0) {
          return {
            content: [{ type: "text", text: "No matching elements found." }]
          };
        }
        const lines = elements.map((el) => {
          const parts = [`[${el.tag}]`];
          if (el.id) parts.push(`#${el.id}`);
          if (el.role) parts.push(`role="${el.role}"`);
          if (el.ariaLabel) parts.push(`aria="${el.ariaLabel}"`);
          if (el.text) parts.push(`"${String(el.text).slice(0, 80)}"`);
          if (!el.visible) parts.push("(hidden)");
          return parts.join(" ");
        });
        return {
          content: [
            {
              type: "text",
              text: `Found ${elements.length} elements:
${lines.join("\n")}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Query failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_get_page_text",
    "Extract all visible text from the page. Fast, no DOM overhead.",
    {
      includeHidden: z3.boolean().optional().describe("Include hidden text (default: false)")
    },
    async ({ includeHidden }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const prop = includeHidden ? "innerText" : "innerText";
        const { result } = await conn.client.Runtime.evaluate({
          expression: `document.body.${prop}`,
          returnByValue: true
        });
        return {
          content: [{ type: "text", text: String(result.value || "(empty page)") }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Get text failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_get_page_html",
    "Get HTML source of the page or a specific element.",
    {
      selector: z3.string().optional().describe("CSS selector (default: whole page)"),
      outerHTML: z3.boolean().optional().describe("Include the element itself (default: true)")
    },
    async ({ selector, outerHTML }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const useOuter = outerHTML !== false;
        const prop = useOuter ? "outerHTML" : "innerHTML";
        const sel = selector || "document.documentElement";
        const expr = selector ? `document.querySelector(${JSON.stringify(selector)})?.${prop} || 'Element not found'` : `document.documentElement.${prop}`;
        const { result } = await client.Runtime.evaluate({
          expression: expr,
          returnByValue: true
        });
        const html = String(result.value);
        if (html.length > 5e4) {
          return {
            content: [
              {
                type: "text",
                text: `HTML (truncated to 50000 chars):
${html.slice(0, 5e4)}

... (${html.length - 5e4} chars truncated)`
              }
            ]
          };
        }
        return {
          content: [{ type: "text", text: html }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Get HTML failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_get_computed_style",
    "Get computed CSS properties for an element.",
    {
      selector: z3.string().describe("CSS selector of the element"),
      properties: z3.array(z3.string()).optional().describe("Specific CSS properties to get (default: all common ones)")
    },
    async ({ selector, properties }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const props = properties || [
          "display",
          "visibility",
          "opacity",
          "position",
          "width",
          "height",
          "margin",
          "padding",
          "color",
          "background-color",
          "font-size",
          "font-weight",
          "font-family",
          "border",
          "border-radius",
          "box-shadow",
          "overflow",
          "z-index",
          "flex-direction",
          "justify-content",
          "align-items"
        ];
        const { result } = await client.Runtime.evaluate({
          expression: `
            (function() {
              const el = document.querySelector(${JSON.stringify(selector)});
              if (!el) return null;
              const cs = window.getComputedStyle(el);
              return ${JSON.stringify(props)}.reduce((acc, p) => {
                acc[p] = cs.getPropertyValue(p);
                return acc;
              }, {});
            })()
          `,
          returnByValue: true
        });
        if (!result.value) {
          return {
            content: [{ type: "text", text: `Element not found: ${selector}` }],
            isError: true
          };
        }
        const styles = result.value;
        const lines = Object.entries(styles).filter(([, v]) => v && v !== "none" && v !== "normal" && v !== "auto").map(([k, v]) => `${k}: ${v}`);
        return {
          content: [
            {
              type: "text",
              text: `Computed styles for "${selector}":
${lines.join("\n")}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Get style failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_get_page_metrics",
    "Get page performance metrics: FCP, LCP, CLS, TBT, DOM size, memory.",
    {},
    async () => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        await pool2.ensureDomain("Performance", pool2.getActiveTabId());
        const { metrics } = await client.Performance.getMetrics();
        const metricMap = new Map(
          metrics.map((m) => [m.name, m.value])
        );
        const { result: vitals } = await client.Runtime.evaluate({
          expression: `
            (function() {
              const perf = performance.getEntriesByType('navigation')[0] || {};
              const paint = performance.getEntriesByType('paint') || [];
              const fcp = paint.find(p => p.name === 'first-contentful-paint');
              return {
                navigationStart: perf.startTime || 0,
                domContentLoaded: perf.domContentLoadedEventEnd || 0,
                loadComplete: perf.loadEventEnd || 0,
                fcp: fcp ? fcp.startTime : null,
                domNodes: document.querySelectorAll('*').length,
                bodySize: document.body?.innerHTML?.length || 0,
              };
            })()
          `,
          returnByValue: true
        });
        const v = vitals.value;
        const lines = [
          `DOM Nodes: ${v.domNodes}`,
          `Body Size: ${Math.round(Number(v.bodySize) / 1024)}KB`,
          `DOM Content Loaded: ${Math.round(Number(v.domContentLoaded))}ms`,
          `Load Complete: ${Math.round(Number(v.loadComplete))}ms`,
          v.fcp ? `First Contentful Paint: ${Math.round(Number(v.fcp))}ms` : null,
          metricMap.has("JSHeapUsedSize") ? `JS Heap: ${Math.round(Number(metricMap.get("JSHeapUsedSize")) / 1024 / 1024)}MB` : null,
          metricMap.has("Nodes") ? `Layout Nodes: ${metricMap.get("Nodes")}` : null
        ].filter(Boolean).join("\n");
        return {
          content: [{ type: "text", text: `Page Metrics:
${lines}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Get metrics failed: ${error}` }],
          isError: true
        };
      }
    }
  );
}

// src/tools/interaction.ts
import { z as z4 } from "zod";

// src/utils/timing.ts
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// src/tools/interaction.ts
function registerInteractionTools(server2, getPool2) {
  const requirePool = () => {
    const pool2 = getPool2();
    if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool2;
  };
  server2.tool(
    "spectra_click",
    "Click an element by selector, accessibility name, or coordinates.",
    {
      target: z4.string().describe("Element to click (CSS selector, XPath, accessibility name, text, or 'x,y' coords)"),
      button: z4.enum(["left", "right", "middle"]).optional().describe("Mouse button (default: left)"),
      clickCount: z4.number().optional().describe("Number of clicks (default: 1, use 2 for double-click)")
    },
    async ({ target, button, clickCount }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const element = await resolveTarget(client, target);
        const cx = element.boundingBox.x + element.boundingBox.width / 2;
        const cy = element.boundingBox.y + element.boundingBox.height / 2;
        const btn = button === "right" ? "right" : button === "middle" ? "middle" : "left";
        const count = clickCount ?? 1;
        for (let i = 0; i < count; i++) {
          await client.Input.dispatchMouseEvent({
            type: "mousePressed",
            x: cx,
            y: cy,
            button: btn,
            clickCount: i + 1
          });
          await client.Input.dispatchMouseEvent({
            type: "mouseReleased",
            x: cx,
            y: cy,
            button: btn,
            clickCount: i + 1
          });
        }
        await sleep(100);
        return {
          content: [
            {
              type: "text",
              text: `Clicked "${target}" at (${Math.round(cx)}, ${Math.round(cy)}) [${btn}${count > 1 ? ` x${count}` : ""}]`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Click failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_type",
    "Type text into an element or the currently focused element.",
    {
      text: z4.string().describe("Text to type"),
      target: z4.string().optional().describe("Element to focus before typing (optional)"),
      delay: z4.number().optional().describe("Delay between keystrokes in ms (default: 0)"),
      clearFirst: z4.boolean().optional().describe("Clear existing text before typing (default: false)")
    },
    async ({ text, target, delay, clearFirst }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        if (target) {
          const element = await resolveTarget(client, target);
          await client.DOM.focus({ nodeId: element.nodeId });
        }
        if (clearFirst) {
          await client.Input.dispatchKeyEvent({ type: "keyDown", key: "a", code: "KeyA", modifiers: 2 });
          await client.Input.dispatchKeyEvent({ type: "keyUp", key: "a", code: "KeyA", modifiers: 2 });
          await client.Input.dispatchKeyEvent({ type: "keyDown", key: "Backspace", code: "Backspace" });
          await client.Input.dispatchKeyEvent({ type: "keyUp", key: "Backspace", code: "Backspace" });
        }
        const keystrokeDelay = delay ?? 0;
        for (const char of text) {
          await client.Input.dispatchKeyEvent({
            type: "keyDown",
            text: char
          });
          await client.Input.dispatchKeyEvent({
            type: "keyUp",
            text: char
          });
          if (keystrokeDelay > 0) {
            await sleep(keystrokeDelay);
          }
        }
        return {
          content: [
            {
              type: "text",
              text: `Typed "${text.length > 50 ? text.slice(0, 50) + "..." : text}"${target ? ` into "${target}"` : ""}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Type failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_press_key",
    "Press a keyboard key or key combination (Enter, Tab, Escape, shortcuts like Ctrl+C).",
    {
      key: z4.string().describe("Key to press (e.g., 'Enter', 'Tab', 'Escape', 'a', 'ArrowDown')"),
      modifiers: z4.array(z4.enum(["ctrl", "shift", "alt", "meta"])).optional().describe("Modifier keys to hold")
    },
    async ({ key, modifiers }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        let modFlag = 0;
        if (modifiers) {
          if (modifiers.includes("alt")) modFlag |= 1;
          if (modifiers.includes("ctrl")) modFlag |= 2;
          if (modifiers.includes("meta")) modFlag |= 4;
          if (modifiers.includes("shift")) modFlag |= 8;
        }
        await client.Input.dispatchKeyEvent({
          type: "keyDown",
          key,
          code: keyToCode(key),
          modifiers: modFlag
        });
        await client.Input.dispatchKeyEvent({
          type: "keyUp",
          key,
          code: keyToCode(key),
          modifiers: modFlag
        });
        const modStr = modifiers?.length ? modifiers.join("+") + "+" : "";
        return {
          content: [{ type: "text", text: `Pressed ${modStr}${key}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Key press failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_select_option",
    "Select an option in a <select> dropdown.",
    {
      selector: z4.string().describe("CSS selector of the <select> element"),
      value: z4.string().optional().describe("Option value to select"),
      label: z4.string().optional().describe("Option label/text to select"),
      index: z4.number().optional().describe("Option index to select (0-based)")
    },
    async ({ selector, value, label, index }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        let expression;
        if (value !== void 0) {
          expression = `(function() { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return 'not found'; el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('change', {bubbles: true})); return el.value; })()`;
        } else if (label !== void 0) {
          expression = `(function() { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return 'not found'; const opt = Array.from(el.options).find(o => o.text === ${JSON.stringify(label)}); if (!opt) return 'option not found'; el.value = opt.value; el.dispatchEvent(new Event('change', {bubbles: true})); return opt.text; })()`;
        } else if (index !== void 0) {
          expression = `(function() { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return 'not found'; el.selectedIndex = ${index}; el.dispatchEvent(new Event('change', {bubbles: true})); return el.options[${index}]?.text || 'selected'; })()`;
        } else {
          throw new Error("Provide value, label, or index");
        }
        const { result } = await client.Runtime.evaluate({ expression, returnByValue: true });
        return {
          content: [{ type: "text", text: `Selected: ${result.value}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Select failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_check",
    "Check or uncheck a checkbox or radio button.",
    {
      selector: z4.string().describe("CSS selector of the checkbox/radio"),
      checked: z4.boolean().describe("Whether to check (true) or uncheck (false)")
    },
    async ({ selector, checked }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const { result } = await conn.client.Runtime.evaluate({
          expression: `(function() { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return 'not found'; if (el.checked !== ${checked}) { el.click(); } return el.checked; })()`,
          returnByValue: true
        });
        return {
          content: [{ type: "text", text: `Checkbox ${selector}: ${result.value ? "checked" : "unchecked"}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Check failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_hover",
    "Hover over an element.",
    {
      target: z4.string().describe("Element to hover (CSS selector, accessibility name, etc.)")
    },
    async ({ target }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const element = await resolveTarget(client, target);
        const cx = element.boundingBox.x + element.boundingBox.width / 2;
        const cy = element.boundingBox.y + element.boundingBox.height / 2;
        await client.Input.dispatchMouseEvent({
          type: "mouseMoved",
          x: cx,
          y: cy
        });
        return {
          content: [{ type: "text", text: `Hovering over "${target}" at (${Math.round(cx)}, ${Math.round(cy)})` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Hover failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_scroll",
    "Scroll the page or a specific element.",
    {
      target: z4.string().optional().describe("Element to scroll (default: page)"),
      direction: z4.enum(["up", "down", "left", "right"]).describe("Scroll direction"),
      amount: z4.union([z4.number(), z4.enum(["page", "top", "bottom"])]).optional().describe("Pixels to scroll, or 'page'/'top'/'bottom' (default: 400px)")
    },
    async ({ target, direction, amount }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        if (typeof amount === "string") {
          const expr = amount === "top" ? "window.scrollTo(0, 0)" : amount === "bottom" ? "window.scrollTo(0, document.body.scrollHeight)" : `window.scrollBy(0, ${direction === "up" ? "-" : ""}window.innerHeight)`;
          await client.Runtime.evaluate({ expression: expr, returnByValue: true });
        } else {
          const pixels = amount ?? 400;
          const deltaX = direction === "left" ? -pixels : direction === "right" ? pixels : 0;
          const deltaY = direction === "up" ? -pixels : direction === "down" ? pixels : 0;
          if (target) {
            await client.Runtime.evaluate({
              expression: `document.querySelector(${JSON.stringify(target)})?.scrollBy(${deltaX}, ${deltaY})`,
              returnByValue: true
            });
          } else {
            await client.Input.dispatchMouseEvent({
              type: "mouseWheel",
              x: 640,
              y: 360,
              deltaX,
              deltaY
            });
          }
        }
        return {
          content: [{ type: "text", text: `Scrolled ${direction} ${amount ?? "400px"}${target ? ` in "${target}"` : ""}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Scroll failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_drag_drop",
    "Drag an element from source to target.",
    {
      source: z4.string().describe("Source element (CSS selector or accessibility name)"),
      target: z4.string().describe("Target element or destination")
    },
    async ({ source, target: targetSel }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const srcEl = await resolveTarget(client, source);
        const tgtEl = await resolveTarget(client, targetSel);
        const sx = srcEl.boundingBox.x + srcEl.boundingBox.width / 2;
        const sy = srcEl.boundingBox.y + srcEl.boundingBox.height / 2;
        const tx = tgtEl.boundingBox.x + tgtEl.boundingBox.width / 2;
        const ty = tgtEl.boundingBox.y + tgtEl.boundingBox.height / 2;
        await client.Input.dispatchMouseEvent({ type: "mousePressed", x: sx, y: sy, button: "left" });
        await sleep(50);
        await client.Input.dispatchMouseEvent({ type: "mouseMoved", x: tx, y: ty });
        await sleep(50);
        await client.Input.dispatchMouseEvent({ type: "mouseReleased", x: tx, y: ty, button: "left" });
        return {
          content: [{ type: "text", text: `Dragged "${source}" to "${targetSel}"` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Drag/drop failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_upload_file",
    "Upload a file to a file input element.",
    {
      selector: z4.string().describe("CSS selector of the <input type='file'> element"),
      filePath: z4.string().describe("Absolute path to the file to upload")
    },
    async ({ selector, filePath }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const { root } = await client.DOM.getDocument({ depth: 0 });
        const { nodeId } = await client.DOM.querySelector({ nodeId: root.nodeId, selector });
        if (!nodeId) throw new Error(`Element not found: ${selector}`);
        await client.DOM.setFileInputFiles({
          nodeId,
          files: [filePath]
        });
        return {
          content: [{ type: "text", text: `Uploaded "${filePath}" to ${selector}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Upload failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_handle_dialog",
    "Accept or dismiss a JavaScript dialog (alert, confirm, prompt).",
    {
      action: z4.enum(["accept", "dismiss"]).describe("Accept or dismiss the dialog"),
      promptText: z4.string().optional().describe("Text to enter for prompt dialogs")
    },
    async ({ action, promptText }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        await conn.client.Page.handleJavaScriptDialog({
          accept: action === "accept",
          promptText
        });
        return {
          content: [{ type: "text", text: `Dialog ${action}ed${promptText ? ` with text "${promptText}"` : ""}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Handle dialog failed: ${error}` }],
          isError: true
        };
      }
    }
  );
}
function keyToCode(key) {
  const map = {
    Enter: "Enter",
    Tab: "Tab",
    Escape: "Escape",
    Backspace: "Backspace",
    Delete: "Delete",
    ArrowUp: "ArrowUp",
    ArrowDown: "ArrowDown",
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight",
    Home: "Home",
    End: "End",
    PageUp: "PageUp",
    PageDown: "PageDown",
    Space: "Space",
    " ": "Space"
  };
  return map[key] || `Key${key.toUpperCase()}`;
}

// src/tools/tabs.ts
import { z as z5 } from "zod";
function registerTabTools(server2, getPool2) {
  const requirePool = () => {
    const pool2 = getPool2();
    if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool2;
  };
  server2.tool(
    "spectra_new_tab",
    "Open a new browser tab, optionally navigating to a URL.",
    {
      url: z5.string().optional().describe("URL to open (default: about:blank)")
    },
    async ({ url }) => {
      try {
        const pool2 = requirePool();
        const tab = await pool2.createTab(url);
        await pool2.connectToTab(tab.id);
        pool2.setActiveTab(tab.id);
        return {
          content: [
            {
              type: "text",
              text: `New tab created: ${tab.id}
URL: ${tab.url}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `New tab failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_close_tab",
    "Close a browser tab by ID.",
    {
      tabId: z5.string().describe("Tab ID to close")
    },
    async ({ tabId }) => {
      try {
        const pool2 = requirePool();
        await pool2.closeTab(tabId);
        return {
          content: [{ type: "text", text: `Tab ${tabId} closed.` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Close tab failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_switch_tab",
    "Switch the active tab.",
    {
      tabId: z5.string().describe("Tab ID to switch to")
    },
    async ({ tabId }) => {
      try {
        const pool2 = requirePool();
        await pool2.connectToTab(tabId);
        pool2.setActiveTab(tabId);
        const targets = await pool2.listTargets();
        const tab = targets.find((t) => t.id === tabId);
        return {
          content: [
            {
              type: "text",
              text: `Switched to tab ${tabId}: ${tab?.url || "unknown"}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Switch tab failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_list_tabs",
    "List all open browser tabs with URL, title, and active status.",
    {},
    async () => {
      try {
        const pool2 = requirePool();
        const targets = await pool2.listTargets();
        const activeId = pool2.getActiveTabId();
        if (targets.length === 0) {
          return {
            content: [{ type: "text", text: "No tabs open." }]
          };
        }
        const lines = targets.map(
          (t) => `${t.id === activeId ? "-> " : "   "}${t.id}: ${t.url} (${t.title || "untitled"})`
        );
        return {
          content: [
            {
              type: "text",
              text: `${targets.length} tabs:
${lines.join("\n")}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `List tabs failed: ${error}` }],
          isError: true
        };
      }
    }
  );
}

// src/tools/network.ts
import { z as z6 } from "zod";
function registerNetworkTools(server2, getPool2) {
  const requirePool = () => {
    const pool2 = getPool2();
    if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool2;
  };
  server2.tool(
    "spectra_list_network_requests",
    "List captured network requests with optional filters. Data comes from in-memory event bus (instant).",
    {
      urlPattern: z6.string().optional().describe("Regex pattern to filter URLs"),
      method: z6.string().optional().describe("HTTP method filter (GET, POST, etc.)"),
      statusCode: z6.number().optional().describe("Filter by response status code"),
      resourceType: z6.string().optional().describe("Filter by resource type (Document, XHR, Fetch, Script, Stylesheet, Image)"),
      sinceLastCall: z6.boolean().optional().describe("Only show requests since last call to this tool")
    },
    async ({ urlPattern, method, statusCode, resourceType, sinceLastCall }) => {
      try {
        const pool2 = requirePool();
        const bus = pool2.getEventBus();
        let requests = bus.getNetworkRequests();
        if (sinceLastCall) {
          const events = bus.querySinceLastCall("network_list", "network");
          const requestIds = new Set(
            events.map((e) => e.data.requestId).filter(Boolean)
          );
          requests = requests.filter((r) => requestIds.has(r.requestId));
        }
        if (urlPattern) {
          const re = new RegExp(urlPattern, "i");
          requests = requests.filter((r) => re.test(r.url));
        }
        if (method) {
          requests = requests.filter(
            (r) => r.method.toUpperCase() === method.toUpperCase()
          );
        }
        if (statusCode) {
          requests = requests.filter((r) => r.status === statusCode);
        }
        if (resourceType) {
          requests = requests.filter(
            (r) => r.resourceType.toLowerCase() === resourceType.toLowerCase()
          );
        }
        if (requests.length === 0) {
          return {
            content: [{ type: "text", text: "No matching network requests." }]
          };
        }
        const lines = requests.slice(-50).map((r) => {
          const status = r.status ?? "pending";
          const duration = r.timing?.duration ? `${Math.round(r.timing.duration)}ms` : "...";
          return `${r.method} ${status} ${r.url.slice(0, 120)} [${r.resourceType}] ${duration}`;
        });
        return {
          content: [
            {
              type: "text",
              text: `${requests.length} requests${requests.length > 50 ? " (showing last 50)" : ""}:
${lines.join("\n")}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `List requests failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_get_request_detail",
    "Get full request/response details including headers and body for a specific request.",
    {
      requestId: z6.string().describe("Request ID from spectra_list_network_requests")
    },
    async ({ requestId }) => {
      try {
        const pool2 = requirePool();
        const bus = pool2.getEventBus();
        const req = bus.getNetworkRequest(requestId);
        if (!req) {
          return {
            content: [{ type: "text", text: `Request ${requestId} not found.` }],
            isError: true
          };
        }
        let body = "(not available)";
        try {
          const conn = await pool2.getActiveConnection();
          const { body: responseBody } = await conn.client.Network.getResponseBody({
            requestId
          });
          body = responseBody.length > 5e3 ? responseBody.slice(0, 5e3) + `
...(truncated, ${responseBody.length} total)` : responseBody;
        } catch {
        }
        const lines = [
          `${req.method} ${req.url}`,
          `Status: ${req.status ?? "pending"} ${req.statusText || ""}`,
          `Type: ${req.resourceType}`,
          req.mimeType ? `MIME: ${req.mimeType}` : null,
          req.timing?.duration ? `Duration: ${Math.round(req.timing.duration)}ms` : null,
          req.requestHeaders ? `
Request Headers:
${formatHeaders(req.requestHeaders)}` : null,
          req.responseHeaders ? `
Response Headers:
${formatHeaders(req.responseHeaders)}` : null,
          `
Response Body:
${body}`
        ].filter(Boolean).join("\n");
        return {
          content: [{ type: "text", text: lines }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Get request detail failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_intercept_requests",
    "Set up request interception. Intercepted requests can be blocked, modified, or mocked.",
    {
      patterns: z6.array(
        z6.object({
          urlPattern: z6.string().describe("URL glob pattern (e.g., '*.js', '*api/v1*')"),
          resourceType: z6.string().optional().describe("Resource type to match")
        })
      ).describe("Interception patterns"),
      action: z6.enum(["log", "block"]).describe("Action: 'log' to observe, 'block' to prevent loading")
    },
    async ({ patterns, action }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.ensureDomain("Fetch");
        const requestPatterns = patterns.map((p) => ({
          urlPattern: p.urlPattern,
          resourceType: p.resourceType,
          requestStage: "Request"
        }));
        await conn.client.Fetch.enable({ patterns: requestPatterns });
        if (action === "block") {
          conn.client.Fetch.requestPaused(async ({ requestId }) => {
            await conn.client.Fetch.failRequest({
              requestId,
              errorReason: "BlockedByClient"
            });
          });
        }
        return {
          content: [
            {
              type: "text",
              text: `Interception active: ${patterns.map((p) => p.urlPattern).join(", ")} [${action}]`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Intercept failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_mock_response",
    "Set up a mock response for requests matching a URL pattern.",
    {
      urlPattern: z6.string().describe("URL pattern to match (glob)"),
      statusCode: z6.number().optional().describe("Response status code (default: 200)"),
      headers: z6.record(z6.string()).optional().describe("Response headers"),
      body: z6.string().describe("Response body")
    },
    async ({ urlPattern, statusCode, headers, body }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.ensureDomain("Fetch");
        await conn.client.Fetch.enable({
          patterns: [{ urlPattern, requestStage: "Request" }]
        });
        conn.client.Fetch.requestPaused(async ({ requestId }) => {
          const responseHeaders = Object.entries(headers || {}).map(
            ([name, value]) => ({ name, value })
          );
          await conn.client.Fetch.fulfillRequest({
            requestId,
            responseCode: statusCode ?? 200,
            responseHeaders,
            body: Buffer.from(body).toString("base64")
          });
        });
        return {
          content: [
            {
              type: "text",
              text: `Mock active for "${urlPattern}" -> ${statusCode ?? 200} (${body.length} bytes)`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Mock failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_clear_intercepts",
    "Remove all request interceptions and mocks.",
    {},
    async () => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        await conn.client.Fetch.disable();
        return {
          content: [{ type: "text", text: "All interceptions cleared." }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Clear intercepts failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_wait_for_request",
    "Wait for a specific network request to complete.",
    {
      urlPattern: z6.string().describe("URL pattern (regex) to wait for"),
      method: z6.string().optional().describe("HTTP method to match"),
      timeout: z6.number().optional().describe("Timeout in ms (default: 30000)")
    },
    async ({ urlPattern, method, timeout }) => {
      try {
        const pool2 = requirePool();
        const bus = pool2.getEventBus();
        const timeoutMs = timeout || 3e4;
        const re = new RegExp(urlPattern, "i");
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
          const requests = bus.getNetworkRequests();
          const match = requests.find(
            (r) => re.test(r.url) && (!method || r.method.toUpperCase() === method.toUpperCase()) && r.status !== void 0
          );
          if (match) {
            return {
              content: [
                {
                  type: "text",
                  text: `Request matched: ${match.method} ${match.status} ${match.url} (${Math.round(match.timing?.duration ?? 0)}ms)`
                }
              ]
            };
          }
          await new Promise((r) => setTimeout(r, 100));
        }
        throw new Error(`No matching request within ${timeoutMs}ms`);
      } catch (error) {
        return {
          content: [{ type: "text", text: `Wait for request failed: ${error}` }],
          isError: true
        };
      }
    }
  );
}
function formatHeaders(headers) {
  return Object.entries(headers).slice(0, 20).map(([k, v]) => `  ${k}: ${String(v).slice(0, 100)}`).join("\n");
}

// src/tools/console.ts
import { z as z7 } from "zod";
function registerConsoleTools(server2, getPool2) {
  const requirePool = () => {
    const pool2 = getPool2();
    if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool2;
  };
  server2.tool(
    "spectra_get_console_logs",
    "Get console messages from the page. Data comes from in-memory event bus (instant).",
    {
      level: z7.enum(["log", "info", "warn", "error", "debug"]).optional().describe("Filter by log level"),
      pattern: z7.string().optional().describe("Regex pattern to filter messages"),
      sinceLastCall: z7.boolean().optional().describe("Only show messages since last call (diff mode)"),
      limit: z7.number().optional().describe("Max messages to return (default: 50)")
    },
    async ({ level, pattern, sinceLastCall, limit }) => {
      try {
        const pool2 = requirePool();
        const bus = pool2.getEventBus();
        const max = limit || 50;
        let messages = bus.getConsoleMessages(level);
        if (sinceLastCall) {
          const events = bus.querySinceLastCall("console_logs", "console");
          const timestamps = new Set(events.map((e) => e.timestamp));
          messages = messages.filter(
            (m) => timestamps.has(m.timestamp)
          );
        }
        if (pattern) {
          const re = new RegExp(pattern, "i");
          messages = messages.filter((m) => re.test(m.text));
        }
        messages = messages.slice(-max);
        if (messages.length === 0) {
          return {
            content: [{ type: "text", text: "No console messages." }]
          };
        }
        const lines = messages.map((m) => {
          const ts = new Date(m.timestamp).toISOString().slice(11, 23);
          return `[${ts}] [${m.level.toUpperCase()}] ${m.text.slice(0, 200)}`;
        });
        return {
          content: [
            {
              type: "text",
              text: `${messages.length} console messages:
${lines.join("\n")}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Get console logs failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_get_errors",
    "Get all JavaScript errors and unhandled promise rejections.",
    {
      sinceLastCall: z7.boolean().optional().describe("Only show errors since last call")
    },
    async ({ sinceLastCall }) => {
      try {
        const pool2 = requirePool();
        const bus = pool2.getEventBus();
        let errors = bus.getErrors();
        if (sinceLastCall) {
          const events = bus.querySinceLastCall("js_errors", "runtime");
          const timestamps = new Set(events.map((e) => e.timestamp));
          errors = errors.filter((e) => timestamps.has(e.timestamp));
        }
        if (errors.length === 0) {
          return {
            content: [{ type: "text", text: "No JavaScript errors." }]
          };
        }
        const lines = errors.map((e) => {
          const ts = new Date(e.timestamp).toISOString().slice(11, 23);
          const loc = e.url ? ` at ${e.url}${e.lineNumber ? `:${e.lineNumber}` : ""}` : "";
          return `[${ts}] ${e.message}${loc}`;
        });
        return {
          content: [
            {
              type: "text",
              text: `${errors.length} JS errors:
${lines.join("\n")}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Get errors failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_evaluate",
    "Execute JavaScript in the page context and return the result.",
    {
      expression: z7.string().describe("JavaScript expression to evaluate"),
      awaitPromise: z7.boolean().optional().describe("Await the result if it's a Promise (default: true)")
    },
    async ({ expression, awaitPromise }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const { result, exceptionDetails } = await conn.client.Runtime.evaluate({
          expression,
          returnByValue: true,
          awaitPromise: awaitPromise !== false
        });
        if (exceptionDetails) {
          return {
            content: [
              {
                type: "text",
                text: `JS Error: ${exceptionDetails.exception?.description || exceptionDetails.text}`
              }
            ],
            isError: true
          };
        }
        const value = result.value !== void 0 ? typeof result.value === "object" ? JSON.stringify(result.value, null, 2) : String(result.value) : result.description || result.type;
        return {
          content: [{ type: "text", text: `Result: ${value}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Evaluate failed: ${error}` }],
          isError: true
        };
      }
    }
  );
}

// src/tools/framework.ts
import { z as z8 } from "zod";

// src/framework/detector.ts
var DETECTION_SCRIPT = `
(function() {
  const frameworks = [];

  // React
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    const roots = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.getFiberRoots?.(1);
    let version = 'unknown';
    try { version = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers?.values()?.next()?.value?.version || 'unknown'; } catch {}
    frameworks.push({ name: 'React', version });
  }

  // Next.js
  if (window.__NEXT_DATA__) {
    frameworks.push({ name: 'Next.js', version: window.__NEXT_DATA__.buildId || 'unknown', meta: 'page: ' + (window.__NEXT_DATA__.page || '/') });
  }

  // Vue
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    let version = 'unknown';
    try {
      const app = window.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps?.[0];
      version = app?.version || 'unknown';
    } catch {}
    frameworks.push({ name: 'Vue', version });
  }

  // Nuxt
  if (window.__NUXT__) {
    frameworks.push({ name: 'Nuxt', version: window.__NUXT__?.config?.public?.version || 'unknown' });
  }

  // Svelte
  if (document.querySelector('[data-svelte-h]') || window.__svelte_devtools_inject) {
    frameworks.push({ name: 'Svelte', version: 'detected' });
  }

  // Angular
  if (window.ng?.getComponent || document.querySelector('[ng-version]')) {
    const version = document.querySelector('[ng-version]')?.getAttribute('ng-version') || 'unknown';
    frameworks.push({ name: 'Angular', version });
  }

  // SvelteKit
  if (document.querySelector('[data-sveltekit-hydrate]') || window.__sveltekit) {
    frameworks.push({ name: 'SvelteKit', version: 'detected' });
  }

  // Remix
  if (window.__remixContext) {
    frameworks.push({ name: 'Remix', version: 'detected' });
  }

  // Astro
  if (document.querySelector('[data-astro-cid]') || document.querySelector('astro-island')) {
    frameworks.push({ name: 'Astro', version: 'detected' });
  }

  return frameworks;
})()
`;
async function detectFrameworks(client) {
  const { result } = await client.Runtime.evaluate({
    expression: DETECTION_SCRIPT,
    returnByValue: true,
    awaitPromise: false
  });
  return result.value || [];
}

// src/framework/react-agent.ts
var REACT_TREE_SCRIPT = `
(function() {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!hook) return null;

  const roots = hook.getFiberRoots?.(1);
  if (!roots || roots.size === 0) return null;

  const root = roots.values().next().value;
  if (!root || !root.current) return null;

  function getComponentName(fiber) {
    if (!fiber.type) return null;
    return fiber.type.displayName || fiber.type.name || null;
  }

  function serializeFiber(fiber, depth, maxDepth) {
    if (!fiber || depth > maxDepth) return null;

    const name = getComponentName(fiber);
    const isComponent = fiber.tag === 0 || fiber.tag === 1 || fiber.tag === 11 || fiber.tag === 15;

    let props = null;
    if (isComponent && fiber.memoizedProps && name) {
      try {
        const p = {};
        for (const [k, v] of Object.entries(fiber.memoizedProps)) {
          if (k === 'children') continue;
          if (typeof v === 'function') { p[k] = '[function]'; continue; }
          if (typeof v === 'object' && v !== null) { p[k] = '[object]'; continue; }
          p[k] = v;
        }
        if (Object.keys(p).length > 0) props = p;
      } catch {}
    }

    let state = null;
    if (isComponent && fiber.memoizedState && name) {
      try {
        let hook = fiber.memoizedState;
        const states = [];
        let i = 0;
        while (hook && i < 5) {
          if (hook.memoizedState !== undefined && typeof hook.memoizedState !== 'function') {
            const v = hook.memoizedState;
            if (typeof v === 'object' && v !== null && v.current !== undefined) {
              states.push({ ref: typeof v.current });
            } else if (typeof v !== 'object') {
              states.push(v);
            }
          }
          hook = hook.next;
          i++;
        }
        if (states.length > 0) state = states;
      } catch {}
    }

    const children = [];
    let child = fiber.child;
    while (child) {
      const serialized = serializeFiber(child, depth + (name ? 1 : 0), maxDepth);
      if (serialized) {
        if (serialized.name || serialized.children?.length > 0) {
          children.push(serialized);
        }
      }
      child = child.sibling;
    }

    if (!name && children.length === 0) return null;
    if (!name && children.length > 0) {
      return { name: null, children };
    }

    const result = { name };
    if (props) result.props = props;
    if (state) result.state = state;
    if (children.length > 0) result.children = children;
    return result;
  }

  return serializeFiber(root.current, 0, DEPTH_PLACEHOLDER);
})()
`;
function getReactTreeScript(depth, includeProps, includeState) {
  let script = REACT_TREE_SCRIPT.replace("DEPTH_PLACEHOLDER", String(depth));
  if (!includeProps) {
    script = script.replace(/let props = null;[\s\S]*?if \(Object\.keys\(p\)\.length > 0\) props = p;/, "let props = null;");
  }
  if (!includeState) {
    script = script.replace(/let state = null;[\s\S]*?if \(states\.length > 0\) state = states;/, "let state = null;");
  }
  return script;
}

// src/framework/vue-agent.ts
var VUE_TREE_SCRIPT = `
(function() {
  const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
  if (!hook || !hook.apps || hook.apps.length === 0) return null;

  const app = hook.apps[0];
  if (!app._instance) return null;

  function serializeComponent(instance, depth, maxDepth) {
    if (!instance || depth > maxDepth) return null;

    const name = instance.type?.__name || instance.type?.name || 'Anonymous';

    let props = null;
    if (instance.props && Object.keys(instance.props).length > 0) {
      try {
        props = {};
        for (const [k, v] of Object.entries(instance.props)) {
          if (typeof v === 'function') { props[k] = '[function]'; continue; }
          if (typeof v === 'object' && v !== null) { props[k] = '[object]'; continue; }
          props[k] = v;
        }
      } catch {}
    }

    let state = null;
    if (instance.setupState) {
      try {
        state = {};
        for (const [k, v] of Object.entries(instance.setupState)) {
          if (typeof v === 'function') continue;
          if (typeof v === 'object' && v !== null) {
            state[k] = v._value !== undefined ? v._value : '[reactive]';
          } else {
            state[k] = v;
          }
        }
        if (Object.keys(state).length === 0) state = null;
      } catch {}
    }

    const children = [];
    if (instance.subTree?.component) {
      const child = serializeComponent(instance.subTree.component, depth + 1, maxDepth);
      if (child) children.push(child);
    }

    // Walk VNode children
    function walkVNode(vnode) {
      if (!vnode) return;
      if (vnode.component) {
        const child = serializeComponent(vnode.component, depth + 1, maxDepth);
        if (child) children.push(child);
      }
      if (Array.isArray(vnode.children)) {
        for (const child of vnode.children) {
          if (typeof child === 'object') walkVNode(child);
        }
      }
    }

    if (instance.subTree) walkVNode(instance.subTree);

    const result = { name };
    if (props && Object.keys(props).length > 0) result.props = props;
    if (state) result.state = state;
    if (children.length > 0) result.children = children;
    return result;
  }

  return serializeComponent(app._instance, 0, DEPTH_PLACEHOLDER);
})()
`;
function getVueTreeScript(depth) {
  return VUE_TREE_SCRIPT.replace("DEPTH_PLACEHOLDER", String(depth));
}

// src/tools/framework.ts
function registerFrameworkTools(server2, getPool2) {
  const requirePool = () => {
    const pool2 = getPool2();
    if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool2;
  };
  server2.tool(
    "spectra_detect_framework",
    "Detect frontend frameworks: React, Vue, Svelte, Angular, Next.js, Nuxt, SvelteKit, Remix, Astro.",
    {},
    async () => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const frameworks = await detectFrameworks(conn.client);
        if (frameworks.length === 0) {
          return {
            content: [{ type: "text", text: "No known frameworks detected on this page." }]
          };
        }
        const lines = frameworks.map(
          (f) => `${f.name} v${f.version || "unknown"}${f.meta ? ` (${f.meta})` : ""}`
        );
        return {
          content: [
            {
              type: "text",
              text: `Detected frameworks:
${lines.join("\n")}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Framework detection failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_get_component_tree",
    "Get the React/Vue component hierarchy with props and state. Requires React/Vue DevTools hooks.",
    {
      depth: z8.number().optional().describe("Max tree depth (default: 10)"),
      includeProps: z8.boolean().optional().describe("Include component props (default: true)"),
      includeState: z8.boolean().optional().describe("Include component state (default: true)")
    },
    async ({ depth, includeProps, includeState }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const frameworks = await detectFrameworks(client);
        const hasReact = frameworks.some((f) => f.name === "React");
        const hasVue = frameworks.some((f) => f.name === "Vue");
        let tree = null;
        let framework = "";
        if (hasReact) {
          const script = getReactTreeScript(
            depth ?? 10,
            includeProps !== false,
            includeState !== false
          );
          const { result } = await client.Runtime.evaluate({
            expression: script,
            returnByValue: true
          });
          tree = result.value;
          framework = "React";
        } else if (hasVue) {
          const script = getVueTreeScript(depth ?? 10);
          const { result } = await client.Runtime.evaluate({
            expression: script,
            returnByValue: true
          });
          tree = result.value;
          framework = "Vue";
        } else {
          const { result } = await client.Runtime.evaluate({
            expression: `
              (function() {
                const svelteEls = document.querySelectorAll('[data-svelte-h]');
                if (svelteEls.length === 0) return null;
                return Array.from(svelteEls).slice(0, 50).map(el => ({
                  tag: el.tagName.toLowerCase(),
                  hash: el.getAttribute('data-svelte-h'),
                  text: el.textContent?.trim()?.slice(0, 100),
                }));
              })()
            `,
            returnByValue: true
          });
          if (result.value) {
            tree = result.value;
            framework = "Svelte";
          }
        }
        if (!tree) {
          return {
            content: [
              {
                type: "text",
                text: "No component tree available. Ensure the page uses React, Vue, or Svelte with DevTools hooks enabled."
              }
            ]
          };
        }
        const formatted = formatComponentTree(tree, 0);
        return {
          content: [
            {
              type: "text",
              text: `${framework} Component Tree:
${formatted}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Get component tree failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_get_component_state",
    "Get props and state of a specific component by name.",
    {
      componentName: z8.string().describe("Component name to find")
    },
    async ({ componentName }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const { result } = await client.Runtime.evaluate({
          expression: `
            (function() {
              const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
              if (!hook) return null;
              const roots = hook.getFiberRoots?.(1);
              if (!roots || roots.size === 0) return null;
              const root = roots.values().next().value;

              function findComponent(fiber, name) {
                if (!fiber) return null;
                const fiberName = fiber.type?.displayName || fiber.type?.name;
                if (fiberName === name) {
                  const result = { name: fiberName };
                  if (fiber.memoizedProps) {
                    result.props = {};
                    for (const [k, v] of Object.entries(fiber.memoizedProps)) {
                      if (k === 'children') continue;
                      result.props[k] = typeof v === 'function' ? '[fn]' : typeof v === 'object' ? JSON.stringify(v)?.slice(0, 200) : v;
                    }
                  }
                  if (fiber.memoizedState) {
                    result.hooks = [];
                    let h = fiber.memoizedState;
                    let i = 0;
                    while (h && i < 10) {
                      const s = h.memoizedState;
                      if (s !== undefined && typeof s !== 'function') {
                        result.hooks.push(typeof s === 'object' ? JSON.stringify(s)?.slice(0, 200) : s);
                      }
                      h = h.next; i++;
                    }
                  }
                  return result;
                }
                let found = findComponent(fiber.child, name);
                if (found) return found;
                return findComponent(fiber.sibling, name);
              }

              return findComponent(root.current, ${JSON.stringify(componentName)});
            })()
          `,
          returnByValue: true
        });
        if (!result.value) {
          return {
            content: [
              {
                type: "text",
                text: `Component "${componentName}" not found in the React tree.`
              }
            ]
          };
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result.value, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Get component state failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_trigger_component_update",
    "Force a component state change (React only). Triggers a re-render.",
    {
      componentName: z8.string().describe("Component name to update"),
      stateUpdate: z8.string().describe("JSON string of the state update to apply")
    },
    async ({ componentName, stateUpdate }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const { result } = await client.Runtime.evaluate({
          expression: `
            (function() {
              const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
              if (!hook) return 'No React DevTools hook found';
              const roots = hook.getFiberRoots?.(1);
              if (!roots || roots.size === 0) return 'No React roots found';
              const root = roots.values().next().value;

              function findFiber(fiber, name) {
                if (!fiber) return null;
                const fiberName = fiber.type?.displayName || fiber.type?.name;
                if (fiberName === name) return fiber;
                return findFiber(fiber.child, name) || findFiber(fiber.sibling, name);
              }

              const fiber = findFiber(root.current, ${JSON.stringify(componentName)});
              if (!fiber) return 'Component not found';

              // Attempt to trigger setState via the updater
              if (fiber.stateNode?.setState) {
                fiber.stateNode.setState(${stateUpdate});
                return 'State updated (class component)';
              }

              return 'Component found but automatic state update not supported for this component type. Use spectra_evaluate for manual updates.';
            })()
          `,
          returnByValue: true
        });
        return {
          content: [{ type: "text", text: String(result.value) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Trigger update failed: ${error}` }],
          isError: true
        };
      }
    }
  );
}
function formatComponentTree(node, depth) {
  if (!node || typeof node !== "object") return "";
  const n = node;
  const pad = "  ".repeat(depth);
  const lines = [];
  if (n.name) {
    let line = `${pad}<${n.name}`;
    if (n.props && typeof n.props === "object") {
      const props = Object.entries(n.props).slice(0, 5).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(" ");
      if (props) line += ` ${props}`;
    }
    if (n.state) {
      line += ` [state: ${JSON.stringify(n.state).slice(0, 80)}]`;
    }
    line += ">";
    lines.push(line);
  }
  if (Array.isArray(n.children)) {
    for (const child of n.children) {
      lines.push(formatComponentTree(child, depth + (n.name ? 1 : 0)));
    }
  }
  return lines.filter(Boolean).join("\n");
}

// src/tools/assertions.ts
import { z as z9 } from "zod";
function registerAssertionTools(server2, getPool2) {
  const requirePool = () => {
    const pool2 = getPool2();
    if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool2;
  };
  server2.tool(
    "spectra_assert_visible",
    "Assert that an element is visible on the page. Returns structured result with suggestion on failure.",
    {
      target: z9.string().describe("Element to check (CSS selector, accessibility name, text)"),
      timeout: z9.number().optional().describe("Time to wait for element (default: 5000ms)")
    },
    async ({ target, timeout }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const timeoutMs = timeout || 5e3;
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
          try {
            const element = await resolveTarget(client, target);
            if (element.boundingBox.width > 0 && element.boundingBox.height > 0) {
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify({
                      passed: true,
                      assertion: "assert_visible",
                      target,
                      actual: `Element visible at (${element.boundingBox.x}, ${element.boundingBox.y}), ${element.boundingBox.width}x${element.boundingBox.height}`,
                      expected: "Element is visible"
                    })
                  }
                ]
              };
            }
          } catch {
          }
          await new Promise((r) => setTimeout(r, 200));
        }
        const { result: candidates } = await client.Runtime.evaluate({
          expression: `
            Array.from(document.querySelectorAll('button, a, input, [role], h1, h2, h3, p, span'))
              .filter(el => el.offsetParent !== null)
              .map(el => el.textContent?.trim()?.slice(0, 60) || el.getAttribute('aria-label') || el.tagName.toLowerCase())
              .filter(Boolean)
              .slice(0, 10)
          `,
          returnByValue: true
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                passed: false,
                assertion: "assert_visible",
                target,
                actual: "Element not found or not visible",
                expected: "Element is visible",
                suggestion: `Element "${target}" not found after ${timeoutMs}ms. Try spectra_get_snapshot to see what's on the page, or use a different selector.`,
                candidates: candidates.value || []
              })
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Assert visible failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_assert_text",
    "Assert text content matches on the page or in an element. Returns structured result.",
    {
      target: z9.string().optional().describe("Element to check (default: whole page body)"),
      text: z9.string().describe("Text to match"),
      operator: z9.enum(["equals", "contains", "matches"]).optional().describe("Match operator (default: contains)")
    },
    async ({ target, text, operator }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const op = operator || "contains";
        const expr = target ? `document.querySelector(${JSON.stringify(target)})?.textContent?.trim() || ''` : `document.body.innerText`;
        const { result } = await client.Runtime.evaluate({
          expression: expr,
          returnByValue: true
        });
        const actual = String(result.value || "");
        let passed = false;
        switch (op) {
          case "equals":
            passed = actual === text;
            break;
          case "contains":
            passed = actual.includes(text);
            break;
          case "matches":
            passed = new RegExp(text).test(actual);
            break;
        }
        const response = {
          passed,
          assertion: "assert_text",
          target: target || "body",
          actual: actual.slice(0, 200),
          expected: `${op} "${text}"`,
          ...passed ? {} : {
            suggestion: `Text "${text}" not found. The actual text ${target ? `of "${target}"` : "on the page"} starts with: "${actual.slice(0, 100)}..."`
          }
        };
        return {
          content: [{ type: "text", text: JSON.stringify(response) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Assert text failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_assert_page_state",
    "Run multiple assertions at once. Returns structured results for each.",
    {
      assertions: z9.array(
        z9.object({
          type: z9.enum(["visible", "text", "url", "title", "count"]).describe("Assertion type"),
          target: z9.string().optional().describe("Selector or target"),
          expected: z9.string().describe("Expected value")
        })
      ).describe("Array of assertions to check")
    },
    async ({ assertions }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const results = [];
        for (const assertion of assertions) {
          switch (assertion.type) {
            case "visible": {
              try {
                const element = await resolveTarget(client, assertion.target || assertion.expected);
                results.push({
                  type: "visible",
                  passed: element.boundingBox.width > 0,
                  actual: element.boundingBox.width > 0 ? "visible" : "hidden",
                  expected: assertion.expected
                });
              } catch {
                results.push({
                  type: "visible",
                  passed: false,
                  actual: "not found",
                  expected: assertion.expected,
                  suggestion: "Element not found. Check your selector."
                });
              }
              break;
            }
            case "text": {
              const expr = assertion.target ? `document.querySelector(${JSON.stringify(assertion.target)})?.textContent?.trim() || ''` : `document.body.innerText`;
              const { result } = await client.Runtime.evaluate({ expression: expr, returnByValue: true });
              const actual = String(result.value || "");
              results.push({
                type: "text",
                passed: actual.includes(assertion.expected),
                actual: actual.slice(0, 100),
                expected: assertion.expected
              });
              break;
            }
            case "url": {
              const { result } = await client.Runtime.evaluate({ expression: "window.location.href", returnByValue: true });
              const actual = String(result.value);
              results.push({
                type: "url",
                passed: new RegExp(assertion.expected).test(actual),
                actual,
                expected: assertion.expected
              });
              break;
            }
            case "title": {
              const { result } = await client.Runtime.evaluate({ expression: "document.title", returnByValue: true });
              const actual = String(result.value);
              results.push({
                type: "title",
                passed: actual.includes(assertion.expected),
                actual,
                expected: assertion.expected
              });
              break;
            }
            case "count": {
              const { result } = await client.Runtime.evaluate({
                expression: `document.querySelectorAll(${JSON.stringify(assertion.target || "*")}).length`,
                returnByValue: true
              });
              const actual = Number(result.value);
              const expected = Number(assertion.expected);
              results.push({
                type: "count",
                passed: actual === expected,
                actual: String(actual),
                expected: assertion.expected
              });
              break;
            }
          }
        }
        const allPassed = results.every((r) => r.passed);
        const summary = `${results.filter((r) => r.passed).length}/${results.length} passed`;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ allPassed, summary, results }, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Assert page state failed: ${error}` }],
          isError: true
        };
      }
    }
  );
}

// src/tools/visual.ts
import { z as z10 } from "zod";
function registerVisualTools(server2, getPool2) {
  const requirePool = () => {
    const pool2 = getPool2();
    if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool2;
  };
  server2.tool(
    "spectra_take_screenshot",
    "Capture a screenshot of the page or a specific element. Returns base64 PNG.",
    {
      selector: z10.string().optional().describe("CSS selector for element screenshot (default: full page)"),
      fullPage: z10.boolean().optional().describe("Capture full scrollable page (default: false)"),
      quality: z10.number().optional().describe("JPEG quality 0-100 (default: PNG)")
    },
    async ({ selector, fullPage, quality }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        let clip;
        if (selector) {
          const { result } = await client.Runtime.evaluate({
            expression: `JSON.stringify(document.querySelector(${JSON.stringify(selector)})?.getBoundingClientRect())`,
            returnByValue: true
          });
          if (result.value && result.value !== "null") {
            const rect = JSON.parse(String(result.value));
            clip = { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scale: 1 };
          }
        }
        if (fullPage) {
          const { result } = await client.Runtime.evaluate({
            expression: `JSON.stringify({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight })`,
            returnByValue: true
          });
          const size = JSON.parse(String(result.value));
          clip = { x: 0, y: 0, width: size.width, height: size.height, scale: 1 };
        }
        const format = quality !== void 0 ? "jpeg" : "png";
        const { data } = await client.Page.captureScreenshot({
          format,
          quality,
          clip
        });
        const sizeKB = Math.round(data.length * 3 / 4 / 1024);
        return {
          content: [
            {
              type: "image",
              data,
              mimeType: format === "jpeg" ? "image/jpeg" : "image/png"
            },
            {
              type: "text",
              text: `Screenshot captured (${format}, ~${sizeKB}KB)${selector ? ` of "${selector}"` : ""}${fullPage ? " [full page]" : ""}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Screenshot failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_compare_screenshots",
    "Compare two screenshots using pixel diff. Returns whether they match and diff percentage.",
    {
      baseline: z10.string().describe("Base64 PNG of the baseline screenshot"),
      threshold: z10.number().optional().describe("Acceptable diff percentage (default: 0.1)")
    },
    async ({ baseline, threshold }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const { data: current } = await client.Page.captureScreenshot({
          format: "png"
        });
        const { result } = await client.Runtime.evaluate({
          expression: `
            (async function() {
              const baseline = ${JSON.stringify(baseline)};
              const current = ${JSON.stringify(current)};

              async function loadImage(b64) {
                return new Promise((resolve) => {
                  const img = new Image();
                  img.onload = () => resolve(img);
                  img.src = 'data:image/png;base64,' + b64;
                });
              }

              const [img1, img2] = await Promise.all([loadImage(baseline), loadImage(current)]);
              const canvas = document.createElement('canvas');
              const w = Math.max(img1.width, img2.width);
              const h = Math.max(img1.height, img2.height);
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');

              ctx.drawImage(img1, 0, 0);
              const data1 = ctx.getImageData(0, 0, w, h).data;
              ctx.clearRect(0, 0, w, h);
              ctx.drawImage(img2, 0, 0);
              const data2 = ctx.getImageData(0, 0, w, h).data;

              let diffPixels = 0;
              const totalPixels = w * h;
              for (let i = 0; i < data1.length; i += 4) {
                const dr = Math.abs(data1[i] - data2[i]);
                const dg = Math.abs(data1[i+1] - data2[i+1]);
                const db = Math.abs(data1[i+2] - data2[i+2]);
                if (dr + dg + db > 30) diffPixels++;
              }

              return { diffPercent: (diffPixels / totalPixels) * 100, diffPixels, totalPixels, width: w, height: h };
            })()
          `,
          returnByValue: true,
          awaitPromise: true
        });
        const diff = result.value;
        const thresholdPct = threshold ?? 0.1;
        const passed = diff.diffPercent <= thresholdPct;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                passed,
                diffPercent: Math.round(diff.diffPercent * 100) / 100,
                diffPixels: diff.diffPixels,
                totalPixels: diff.totalPixels,
                dimensions: `${diff.width}x${diff.height}`,
                threshold: thresholdPct,
                suggestion: passed ? void 0 : `${diff.diffPercent.toFixed(2)}% of pixels differ (threshold: ${thresholdPct}%). Use spectra_take_screenshot to capture both states and compare visually.`
              })
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Compare screenshots failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_get_bounding_boxes",
    "Get bounding rectangles for multiple elements. Useful for layout verification.",
    {
      selectors: z10.array(z10.string()).describe("CSS selectors to get bounding boxes for")
    },
    async ({ selectors }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        const { result } = await client.Runtime.evaluate({
          expression: `
            ${JSON.stringify(selectors)}.map(sel => {
              const el = document.querySelector(sel);
              if (!el) return { selector: sel, found: false };
              const rect = el.getBoundingClientRect();
              return {
                selector: sel,
                found: true,
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                visible: el.offsetParent !== null,
              };
            })
          `,
          returnByValue: true
        });
        const boxes = result.value;
        const lines = boxes.map(
          (b) => b.found ? `${b.selector}: (${b.x}, ${b.y}) ${b.width}x${b.height}${b.visible ? "" : " [hidden]"}` : `${b.selector}: NOT FOUND`
        );
        return {
          content: [
            {
              type: "text",
              text: `Bounding boxes:
${lines.join("\n")}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Get bounding boxes failed: ${error}` }],
          isError: true
        };
      }
    }
  );
}

// src/tools/flows.ts
import { z as z11 } from "zod";

// src/flows/recorder.ts
import { stringify } from "yaml";
var recording = false;
var currentFlow = null;
function startRecording(name) {
  recording = true;
  currentFlow = {
    name,
    description: `Flow recorded at ${(/* @__PURE__ */ new Date()).toISOString()}`,
    steps: []
  };
}
function stopRecording() {
  recording = false;
  const flow = currentFlow;
  currentFlow = null;
  return flow;
}
function flowToYaml(flow) {
  const doc = {
    name: flow.name,
    description: flow.description
  };
  if (flow.baseUrl) doc.baseUrl = flow.baseUrl;
  if (flow.variables) doc.variables = flow.variables;
  const steps = flow.steps.map((step) => {
    const s = { [step.action]: step.params };
    return s;
  });
  return stringify({ ...doc, steps }, { lineWidth: 120 });
}

// src/flows/player.ts
import { parse } from "yaml";
function parseFlow(yamlContent) {
  const doc = parse(yamlContent);
  const flow = {
    name: String(doc.name || "unnamed"),
    description: doc.description ? String(doc.description) : void 0,
    baseUrl: doc.baseUrl ? String(doc.baseUrl) : void 0,
    variables: doc.variables,
    steps: []
  };
  const rawSteps = doc.steps;
  if (rawSteps && Array.isArray(rawSteps)) {
    for (const step of rawSteps) {
      const action = Object.keys(step)[0];
      const params = step[action];
      flow.steps.push({ action, params: params || {} });
    }
  }
  return flow;
}
function resolveVariables(flow, overrides) {
  const vars = { ...flow.variables, ...overrides };
  if (Object.keys(vars).length === 0) return flow;
  const resolved = {
    ...flow,
    steps: flow.steps.map((step) => ({
      action: step.action,
      params: resolveParams(step.params, vars)
    }))
  };
  if (resolved.baseUrl) {
    resolved.baseUrl = replaceVars(resolved.baseUrl, vars);
  }
  return resolved;
}
function resolveParams(params, vars) {
  const resolved = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      resolved[key] = replaceVars(value, vars);
    } else if (typeof value === "object" && value !== null) {
      resolved[key] = resolveParams(
        value,
        vars
      );
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}
function replaceVars(s, vars) {
  return s.replace(/\$\{(\w+)\}/g, (_, name) => vars[name] ?? `\${${name}}`);
}

// src/tools/flows.ts
function registerFlowTools(server2, getPool2) {
  const requirePool = () => {
    const pool2 = getPool2();
    if (!pool2) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool2;
  };
  server2.tool(
    "spectra_record_flow",
    "Start or stop recording interactions as a replayable YAML flow (like Maestro flows).",
    {
      action: z11.enum(["start", "stop"]).describe("Start or stop recording"),
      flowName: z11.string().optional().describe("Name for the flow (required for start)")
    },
    async ({ action, flowName }) => {
      try {
        if (action === "start") {
          if (!flowName) throw new Error("flowName required when starting recording");
          startRecording(flowName);
          return {
            content: [
              {
                type: "text",
                text: `Recording started: "${flowName}". All interactions will be captured. Call with action="stop" to finish.`
              }
            ]
          };
        } else {
          const flow = stopRecording();
          if (!flow) {
            return {
              content: [{ type: "text", text: "No recording in progress." }]
            };
          }
          const yaml = flowToYaml(flow);
          return {
            content: [
              {
                type: "text",
                text: `Recording stopped: "${flow.name}" (${flow.steps.length} steps)

---
${yaml}`
              }
            ]
          };
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Record flow failed: ${error}` }],
          isError: true
        };
      }
    }
  );
  server2.tool(
    "spectra_run_flow",
    "Execute a YAML flow. Provide either a file path or inline YAML.",
    {
      flowYaml: z11.string().describe("YAML flow content (inline)"),
      variables: z11.record(z11.string()).optional().describe("Variable overrides (e.g., { USERNAME: 'admin' })"),
      stopOnError: z11.boolean().optional().describe("Stop on first error (default: true)")
    },
    async ({ flowYaml, variables, stopOnError }) => {
      try {
        const pool2 = requirePool();
        const conn = await pool2.getActiveConnection();
        const client = conn.client;
        let flow = parseFlow(flowYaml);
        flow = resolveVariables(flow, variables);
        const results = [];
        const shouldStop = stopOnError !== false;
        for (let i = 0; i < flow.steps.length; i++) {
          const step = flow.steps[i];
          try {
            await executeFlowStep(client, step.action, step.params);
            results.push({ step: i + 1, action: step.action, status: "passed" });
          } catch (error) {
            results.push({
              step: i + 1,
              action: step.action,
              status: "failed",
              error: String(error)
            });
            if (shouldStop) break;
          }
        }
        const passed = results.filter((r) => r.status === "passed").length;
        const failed = results.filter((r) => r.status === "failed").length;
        const lines = results.map(
          (r) => `${r.status === "passed" ? "+" : "x"} Step ${r.step}: ${r.action}${r.error ? ` - ${r.error}` : ""}`
        );
        return {
          content: [
            {
              type: "text",
              text: `Flow "${flow.name}": ${passed} passed, ${failed} failed

${lines.join("\n")}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Run flow failed: ${error}` }],
          isError: true
        };
      }
    }
  );
}
async function executeFlowStep(client, action, params) {
  switch (action) {
    case "navigate":
    case "spectra_navigate": {
      const url = String(params.url || params.value || "");
      await client.Page.navigate({ url });
      await client.Page.loadEventFired();
      break;
    }
    case "wait_for":
    case "spectra_wait_for": {
      const condition = params.condition || "selector";
      const value = String(params.value || params.selector || "");
      const timeout = Number(params.timeout || 1e4);
      if (condition === "selector" || condition === "text") {
        const start = Date.now();
        while (Date.now() - start < timeout) {
          const expr = condition === "selector" ? `!!document.querySelector('${value.replace(/'/g, "\\'")}')` : `document.body.innerText.includes(${JSON.stringify(value)})`;
          const { result } = await client.Runtime.evaluate({
            expression: expr,
            returnByValue: true
          });
          if (result.value === true) return;
          await new Promise((r) => setTimeout(r, 100));
        }
        throw new Error(`Wait timeout: ${condition} "${value}"`);
      }
      break;
    }
    case "click":
    case "spectra_click": {
      const selector = String(params.target || params.selector || "");
      const { result } = await client.Runtime.evaluate({
        expression: `JSON.stringify(document.querySelector(${JSON.stringify(selector)})?.getBoundingClientRect())`,
        returnByValue: true
      });
      if (!result.value || result.value === "null") throw new Error(`Element not found: ${selector}`);
      const rect = JSON.parse(String(result.value));
      const cx = rect.x + rect.width / 2;
      const cy = rect.y + rect.height / 2;
      await client.Input.dispatchMouseEvent({ type: "mousePressed", x: cx, y: cy, button: "left", clickCount: 1 });
      await client.Input.dispatchMouseEvent({ type: "mouseReleased", x: cx, y: cy, button: "left", clickCount: 1 });
      await new Promise((r) => setTimeout(r, 100));
      break;
    }
    case "type":
    case "spectra_type": {
      const target = String(params.target || params.selector || "");
      const text = String(params.text || "");
      if (target) {
        await client.Runtime.evaluate({
          expression: `document.querySelector(${JSON.stringify(target)})?.focus()`,
          returnByValue: true
        });
      }
      for (const char of text) {
        await client.Input.dispatchKeyEvent({ type: "keyDown", text: char });
        await client.Input.dispatchKeyEvent({ type: "keyUp", text: char });
      }
      break;
    }
    case "assert_visible":
    case "spectra_assert_visible": {
      const target = String(params.target || params.text || "");
      const { result } = await client.Runtime.evaluate({
        expression: `!!document.querySelector(${JSON.stringify(target)}) || document.body.innerText.includes(${JSON.stringify(target)})`,
        returnByValue: true
      });
      if (!result.value) throw new Error(`Not visible: ${target}`);
      break;
    }
    case "assert_text":
    case "spectra_assert_text": {
      const expected = String(params.text || params.expected || "");
      const { result } = await client.Runtime.evaluate({
        expression: `document.body.innerText`,
        returnByValue: true
      });
      if (!String(result.value).includes(expected)) {
        throw new Error(`Text not found: "${expected}"`);
      }
      break;
    }
    case "snapshot":
    case "spectra_get_snapshot": {
      break;
    }
    default:
      throw new Error(`Unknown flow action: ${action}`);
  }
}

// src/server.ts
var pool = null;
function getPool() {
  return pool;
}
function setPool(newPool) {
  pool = newPool;
}
function registerAllTools(server2) {
  registerBrowserTools(server2, getPool, setPool);
  registerNavigationTools(server2, getPool);
  registerInspectionTools(server2, getPool);
  registerInteractionTools(server2, getPool);
  registerTabTools(server2, getPool);
  registerNetworkTools(server2, getPool);
  registerConsoleTools(server2, getPool);
  registerFrameworkTools(server2, getPool);
  registerAssertionTools(server2, getPool);
  registerVisualTools(server2, getPool);
  registerFlowTools(server2, getPool);
}

// src/index.ts
var server = new McpServer({
  name: "spectra-mcp-server",
  version: "0.1.0"
});
registerAllTools(server);
async function cleanup() {
  stopHealthMonitor();
  await closeBrowser();
  process.exit(0);
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
var transport = new StdioServerTransport();
await server.connect(transport);
//# sourceMappingURL=index.js.map