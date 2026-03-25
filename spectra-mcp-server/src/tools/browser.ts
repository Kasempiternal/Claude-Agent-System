import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  launchBrowser,
  closeBrowser,
  getBrowserStatus,
} from "../browser/launcher.js";
import { DEVICE_PRESETS, DEFAULT_BROWSER_CONFIG } from "../constants.js";
import type { CDPPool } from "../cdp/pool.js";
import { startHealthMonitor, stopHealthMonitor } from "../browser/health.js";

export function registerBrowserTools(server: McpServer, getPool: () => CDPPool | null, setPool: (pool: CDPPool) => void): void {

  server.tool(
    "spectra_launch_browser",
    "Launch headless Chrome browser. Auto-downloads Chrome if needed. Returns connection info.",
    {
      headless: z.boolean().optional().describe("Run in headless mode (default: true)"),
      width: z.number().optional().describe("Viewport width (default: 1280)"),
      height: z.number().optional().describe("Viewport height (default: 720)"),
      userAgent: z.string().optional().describe("Custom user agent string"),
      locale: z.string().optional().describe("Browser locale (e.g., 'en-US')"),
      timezone: z.string().optional().describe("Timezone (e.g., 'America/New_York')"),
    },
    async ({ headless, width, height, userAgent, locale, timezone }) => {
      try {
        const viewport = {
          width: width ?? DEFAULT_BROWSER_CONFIG.viewport.width,
          height: height ?? DEFAULT_BROWSER_CONFIG.viewport.height,
        };

        const browser = await launchBrowser({
          headless: headless ?? DEFAULT_BROWSER_CONFIG.headless,
          viewport,
          userAgent,
          locale,
          timezone,
        });

        const { CDPPool } = await import("../cdp/pool.js");
        const pool = new CDPPool(browser.port);
        setPool(pool);

        // Connect to the first available tab
        const targets = await pool.listTargets();
        if (targets.length > 0) {
          await pool.connectToTab(targets[0].id);
        }

        startHealthMonitor(pool);

        return {
          content: [
            {
              type: "text" as const,
              text: `Browser launched successfully.\n- Port: ${browser.port}\n- PID: ${browser.pid}\n- Headless: ${headless ?? DEFAULT_BROWSER_CONFIG.headless}\n- Viewport: ${viewport.width}x${viewport.height}\n- Tabs: ${targets.length}\n- Active tab: ${targets[0]?.id || "none"}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Failed to launch browser: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_close_browser",
    "Close the browser and clean up all connections.",
    {},
    async () => {
      try {
        const pool = getPool();
        if (pool) {
          await pool.disconnectAll();
        }
        stopHealthMonitor();
        await closeBrowser();
        setPool(null as unknown as CDPPool);
        return {
          content: [{ type: "text" as const, text: "Browser closed successfully." }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Failed to close browser: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_browser_status",
    "Get browser health status: running state, port, PID, open tabs, memory usage.",
    {},
    async () => {
      try {
        const status = await getBrowserStatus();
        const pool = getPool();

        let tabInfo = "No tabs";
        if (status.running && pool) {
          const targets = await pool.listTargets();
          const activeId = pool.getActiveTabId();
          tabInfo = targets
            .map(
              (t) =>
                `${t.id === activeId ? "→ " : "  "}${t.id}: ${t.url} (${t.title})`
            )
            .join("\n");
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `Browser Status:\n- Running: ${status.running}\n- Port: ${status.port || "N/A"}\n- PID: ${status.pid || "N/A"}\n\nTabs:\n${tabInfo}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Failed to get status: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_set_viewport",
    "Resize the browser viewport for the active tab.",
    {
      width: z.number().describe("Viewport width in pixels"),
      height: z.number().describe("Viewport height in pixels"),
      deviceScaleFactor: z.number().optional().describe("Device scale factor (default: 1)"),
      isMobile: z.boolean().optional().describe("Emulate mobile device (default: false)"),
    },
    async ({ width, height, deviceScaleFactor, isMobile }) => {
      try {
        const pool = getPool();
        if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");

        const conn = await pool.getActiveConnection();
        await conn.client.Emulation.setDeviceMetricsOverride({
          width,
          height,
          deviceScaleFactor: deviceScaleFactor ?? 1,
          mobile: isMobile ?? false,
        });

        return {
          content: [
            {
              type: "text" as const,
              text: `Viewport set to ${width}x${height} (scale: ${deviceScaleFactor ?? 1}, mobile: ${isMobile ?? false})`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Failed to set viewport: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_emulate_device",
    `Emulate a device preset. Available: ${Object.keys(DEVICE_PRESETS).join(", ")}`,
    {
      device: z.string().describe(`Device preset name: ${Object.keys(DEVICE_PRESETS).join(", ")}`),
    },
    async ({ device }) => {
      try {
        const pool = getPool();
        if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");

        const preset = DEVICE_PRESETS[device];
        if (!preset) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Unknown device "${device}". Available: ${Object.keys(DEVICE_PRESETS).join(", ")}`,
              },
            ],
            isError: true,
          };
        }

        const conn = await pool.getActiveConnection();
        await conn.client.Emulation.setDeviceMetricsOverride({
          width: preset.viewport.width,
          height: preset.viewport.height,
          deviceScaleFactor: preset.deviceScaleFactor,
          mobile: preset.isMobile,
        });

        if (preset.userAgent) {
          await conn.client.Emulation.setUserAgentOverride({
            userAgent: preset.userAgent,
          });
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `Emulating ${preset.name}: ${preset.viewport.width}x${preset.viewport.height} (scale: ${preset.deviceScaleFactor}, mobile: ${preset.isMobile})`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Failed to emulate device: ${error}` }],
          isError: true,
        };
      }
    }
  );
}
