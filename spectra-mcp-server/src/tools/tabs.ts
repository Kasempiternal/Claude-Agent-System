import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CDPPool } from "../cdp/pool.js";

export function registerTabTools(
  server: McpServer,
  getPool: () => CDPPool | null
): void {
  const requirePool = () => {
    const pool = getPool();
    if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool;
  };

  server.tool(
    "spectra_new_tab",
    "Open a new browser tab, optionally navigating to a URL.",
    {
      url: z.string().optional().describe("URL to open (default: about:blank)"),
    },
    async ({ url }) => {
      try {
        const pool = requirePool();
        const tab = await pool.createTab(url);
        await pool.connectToTab(tab.id);
        pool.setActiveTab(tab.id);

        return {
          content: [
            {
              type: "text" as const,
              text: `New tab created: ${tab.id}\nURL: ${tab.url}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `New tab failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_close_tab",
    "Close a browser tab by ID.",
    {
      tabId: z.string().describe("Tab ID to close"),
    },
    async ({ tabId }) => {
      try {
        const pool = requirePool();
        await pool.closeTab(tabId);
        return {
          content: [{ type: "text" as const, text: `Tab ${tabId} closed.` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Close tab failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_switch_tab",
    "Switch the active tab.",
    {
      tabId: z.string().describe("Tab ID to switch to"),
    },
    async ({ tabId }) => {
      try {
        const pool = requirePool();
        await pool.connectToTab(tabId);
        pool.setActiveTab(tabId);

        const targets = await pool.listTargets();
        const tab = targets.find((t) => t.id === tabId);

        return {
          content: [
            {
              type: "text" as const,
              text: `Switched to tab ${tabId}: ${tab?.url || "unknown"}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Switch tab failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_list_tabs",
    "List all open browser tabs with URL, title, and active status.",
    {},
    async () => {
      try {
        const pool = requirePool();
        const targets = await pool.listTargets();
        const activeId = pool.getActiveTabId();

        if (targets.length === 0) {
          return {
            content: [{ type: "text" as const, text: "No tabs open." }],
          };
        }

        const lines = targets.map(
          (t) =>
            `${t.id === activeId ? "-> " : "   "}${t.id}: ${t.url} (${t.title || "untitled"})`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: `${targets.length} tabs:\n${lines.join("\n")}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `List tabs failed: ${error}` }],
          isError: true,
        };
      }
    }
  );
}
