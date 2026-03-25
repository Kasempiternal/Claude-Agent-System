import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CDPPool } from "./cdp/pool.js";
import { registerBrowserTools } from "./tools/browser.js";
import { registerNavigationTools } from "./tools/navigation.js";
import { registerInspectionTools } from "./tools/inspection.js";
import { registerInteractionTools } from "./tools/interaction.js";
import { registerTabTools } from "./tools/tabs.js";
import { registerNetworkTools } from "./tools/network.js";
import { registerConsoleTools } from "./tools/console.js";
import { registerFrameworkTools } from "./tools/framework.js";
import { registerAssertionTools } from "./tools/assertions.js";
import { registerVisualTools } from "./tools/visual.js";
import { registerFlowTools } from "./tools/flows.js";

// Shared state — the CDP pool is created when the browser launches
let pool: CDPPool | null = null;

function getPool(): CDPPool | null {
  return pool;
}

function setPool(newPool: CDPPool): void {
  pool = newPool;
}

export function getSharedPool(): CDPPool | null {
  return pool;
}

export function registerAllTools(server: McpServer): void {
  // Phase 1: Browser lifecycle
  registerBrowserTools(server, getPool, setPool);

  // Phase 2: Navigation & Inspection
  registerNavigationTools(server, getPool);
  registerInspectionTools(server, getPool);

  // Phase 3: Interaction & Tabs
  registerInteractionTools(server, getPool);
  registerTabTools(server, getPool);

  // Phase 4: Network & Console intelligence
  registerNetworkTools(server, getPool);
  registerConsoleTools(server, getPool);

  // Phase 5: Framework & Advanced
  registerFrameworkTools(server, getPool);
  registerAssertionTools(server, getPool);
  registerVisualTools(server, getPool);

  // Phase 6: Flows
  registerFlowTools(server, getPool);
}
