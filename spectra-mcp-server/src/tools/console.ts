import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CDPPool } from "../cdp/pool.js";

export function registerConsoleTools(
  server: McpServer,
  getPool: () => CDPPool | null
): void {
  const requirePool = () => {
    const pool = getPool();
    if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool;
  };

  server.tool(
    "spectra_get_console_logs",
    "Get console messages from the page. Data comes from in-memory event bus (instant).",
    {
      level: z
        .enum(["log", "info", "warn", "error", "debug"])
        .optional()
        .describe("Filter by log level"),
      pattern: z.string().optional().describe("Regex pattern to filter messages"),
      sinceLastCall: z
        .boolean()
        .optional()
        .describe("Only show messages since last call (diff mode)"),
      limit: z.number().optional().describe("Max messages to return (default: 50)"),
    },
    async ({ level, pattern, sinceLastCall, limit }) => {
      try {
        const pool = requirePool();
        const bus = pool.getEventBus();
        const max = limit || 50;

        let messages = bus.getConsoleMessages(level);

        if (sinceLastCall) {
          const events = bus.querySinceLastCall("console_logs", "console");
          const timestamps = new Set(events.map((e) => e.timestamp));
          messages = messages.filter((m) =>
            timestamps.has(m.timestamp)
          );
        }

        if (pattern) {
          const re = new RegExp(pattern, "i");
          messages = messages.filter((m) => re.test(m.text));
        }

        messages = messages.slice(-max);

        if (messages.length === 0) {
          return {
            content: [{ type: "text" as const, text: "No console messages." }],
          };
        }

        const lines = messages.map((m) => {
          const ts = new Date(m.timestamp).toISOString().slice(11, 23);
          return `[${ts}] [${m.level.toUpperCase()}] ${m.text.slice(0, 200)}`;
        });

        return {
          content: [
            {
              type: "text" as const,
              text: `${messages.length} console messages:\n${lines.join("\n")}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Get console logs failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_get_errors",
    "Get all JavaScript errors and unhandled promise rejections.",
    {
      sinceLastCall: z
        .boolean()
        .optional()
        .describe("Only show errors since last call"),
    },
    async ({ sinceLastCall }) => {
      try {
        const pool = requirePool();
        const bus = pool.getEventBus();

        let errors = bus.getErrors();

        if (sinceLastCall) {
          const events = bus.querySinceLastCall("js_errors", "runtime");
          const timestamps = new Set(events.map((e) => e.timestamp));
          errors = errors.filter((e) => timestamps.has(e.timestamp));
        }

        if (errors.length === 0) {
          return {
            content: [{ type: "text" as const, text: "No JavaScript errors." }],
          };
        }

        const lines = errors.map((e) => {
          const ts = new Date(e.timestamp).toISOString().slice(11, 23);
          const loc = e.url
            ? ` at ${e.url}${e.lineNumber ? `:${e.lineNumber}` : ""}`
            : "";
          return `[${ts}] ${e.message}${loc}`;
        });

        return {
          content: [
            {
              type: "text" as const,
              text: `${errors.length} JS errors:\n${lines.join("\n")}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Get errors failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_evaluate",
    "Execute JavaScript in the page context and return the result.",
    {
      expression: z.string().describe("JavaScript expression to evaluate"),
      awaitPromise: z
        .boolean()
        .optional()
        .describe("Await the result if it's a Promise (default: true)"),
    },
    async ({ expression, awaitPromise }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();

        const { result, exceptionDetails } =
          await conn.client.Runtime.evaluate({
            expression,
            returnByValue: true,
            awaitPromise: awaitPromise !== false,
          });

        if (exceptionDetails) {
          return {
            content: [
              {
                type: "text" as const,
                text: `JS Error: ${exceptionDetails.exception?.description || exceptionDetails.text}`,
              },
            ],
            isError: true,
          };
        }

        const value =
          result.value !== undefined
            ? typeof result.value === "object"
              ? JSON.stringify(result.value, null, 2)
              : String(result.value)
            : result.description || result.type;

        return {
          content: [{ type: "text" as const, text: `Result: ${value}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Evaluate failed: ${error}` }],
          isError: true,
        };
      }
    }
  );
}
