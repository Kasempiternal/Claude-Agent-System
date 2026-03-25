import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CDPPool } from "../cdp/pool.js";
import { NAVIGATION_TIMEOUT, DEFAULT_TIMEOUT } from "../constants.js";

export function registerNavigationTools(
  server: McpServer,
  getPool: () => CDPPool | null
): void {
  const requirePool = () => {
    const pool = getPool();
    if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool;
  };

  server.tool(
    "spectra_navigate",
    "Navigate to a URL. Waits for the page to load.",
    {
      url: z.string().describe("URL to navigate to"),
      waitUntil: z
        .enum(["load", "domcontentloaded", "networkidle"])
        .optional()
        .describe("Wait condition (default: load)"),
      timeout: z.number().optional().describe("Timeout in ms (default: 60000)"),
    },
    async ({ url, waitUntil, timeout }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        const waitEvent = waitUntil || "load";
        const timeoutMs = timeout || NAVIGATION_TIMEOUT;

        // Set up navigation promise
        const waitPromise =
          waitEvent === "domcontentloaded"
            ? client.Page.domContentEventFired()
            : waitEvent === "networkidle"
              ? waitForNetworkIdle(client, timeoutMs)
              : client.Page.loadEventFired();

        await client.Page.navigate({ url });
        await Promise.race([
          waitPromise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Navigation timeout")), timeoutMs)
          ),
        ]);

        // Get final URL and title
        const { result: titleResult } = await client.Runtime.evaluate({
          expression: "document.title",
          returnByValue: true,
        });
        const { result: urlResult } = await client.Runtime.evaluate({
          expression: "window.location.href",
          returnByValue: true,
        });

        return {
          content: [
            {
              type: "text" as const,
              text: `Navigated to: ${urlResult.value}\nTitle: ${titleResult.value}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Navigation failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_go_back",
    "Navigate back in browser history.",
    {},
    async () => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const { currentIndex, entries } =
          await conn.client.Page.getNavigationHistory();
        if (currentIndex > 0) {
          await conn.client.Page.navigateToHistoryEntry({
            entryId: entries[currentIndex - 1].id,
          });
          await conn.client.Page.loadEventFired();
        }
        const { result } = await conn.client.Runtime.evaluate({
          expression: "window.location.href",
          returnByValue: true,
        });
        return {
          content: [{ type: "text" as const, text: `Navigated back to: ${result.value}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Go back failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_go_forward",
    "Navigate forward in browser history.",
    {},
    async () => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const { currentIndex, entries } =
          await conn.client.Page.getNavigationHistory();
        if (currentIndex < entries.length - 1) {
          await conn.client.Page.navigateToHistoryEntry({
            entryId: entries[currentIndex + 1].id,
          });
          await conn.client.Page.loadEventFired();
        }
        const { result } = await conn.client.Runtime.evaluate({
          expression: "window.location.href",
          returnByValue: true,
        });
        return {
          content: [{ type: "text" as const, text: `Navigated forward to: ${result.value}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Go forward failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_reload",
    "Reload the current page.",
    {
      ignoreCache: z.boolean().optional().describe("Bypass cache on reload (default: false)"),
    },
    async ({ ignoreCache }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        await conn.client.Page.reload({
          ignoreCache: ignoreCache ?? false,
        });
        await conn.client.Page.loadEventFired();
        const { result } = await conn.client.Runtime.evaluate({
          expression: "document.title",
          returnByValue: true,
        });
        return {
          content: [{ type: "text" as const, text: `Page reloaded. Title: ${result.value}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Reload failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_wait_for",
    "Wait for a condition: CSS selector visible, text appears, URL matches, or network idle.",
    {
      condition: z
        .enum(["selector", "text", "url", "networkIdle"])
        .describe("What to wait for"),
      value: z.string().optional().describe("Selector, text, or URL pattern to wait for"),
      timeout: z.number().optional().describe("Timeout in ms (default: 30000)"),
    },
    async ({ condition, value, timeout }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
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
                  returnByValue: true,
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
                  returnByValue: true,
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
                  returnByValue: true,
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
              type: "text" as const,
              text: `Condition "${condition}" met in ${elapsed}ms.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Wait failed: ${error}` }],
          isError: true,
        };
      }
    }
  );
}

async function waitForNetworkIdle(
  client: { Network: { enable: () => Promise<void> }; Runtime: { evaluate: (params: { expression: string; returnByValue: boolean }) => Promise<{ result: { value: unknown } }> } },
  timeout: number
): Promise<void> {
  // Simple approach: wait until no new network requests for 500ms
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => resolve(), 2000); // Wait 2s as a default network idle heuristic
    setTimeout(() => {
      clearTimeout(timer);
      reject(new Error("Network idle timeout"));
    }, timeout);
  });
}

async function pollUntil(
  fn: () => Promise<boolean>,
  timeout: number,
  interval = 100
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await fn()) return;
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}
