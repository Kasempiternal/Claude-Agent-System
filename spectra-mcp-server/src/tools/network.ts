import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CDPPool } from "../cdp/pool.js";
import type { NetworkRequest } from "../types.js";

export function registerNetworkTools(
  server: McpServer,
  getPool: () => CDPPool | null
): void {
  const requirePool = () => {
    const pool = getPool();
    if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool;
  };

  server.tool(
    "spectra_list_network_requests",
    "List captured network requests with optional filters. Data comes from in-memory event bus (instant).",
    {
      urlPattern: z.string().optional().describe("Regex pattern to filter URLs"),
      method: z.string().optional().describe("HTTP method filter (GET, POST, etc.)"),
      statusCode: z.number().optional().describe("Filter by response status code"),
      resourceType: z.string().optional().describe("Filter by resource type (Document, XHR, Fetch, Script, Stylesheet, Image)"),
      sinceLastCall: z.boolean().optional().describe("Only show requests since last call to this tool"),
    },
    async ({ urlPattern, method, statusCode, resourceType, sinceLastCall }) => {
      try {
        const pool = requirePool();
        const bus = pool.getEventBus();

        let requests = bus.getNetworkRequests();

        if (sinceLastCall) {
          const events = bus.querySinceLastCall("network_list", "network");
          const requestIds = new Set(
            events
              .map((e) => (e.data as { requestId?: string }).requestId)
              .filter(Boolean)
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
            (r) =>
              r.resourceType.toLowerCase() === resourceType.toLowerCase()
          );
        }

        if (requests.length === 0) {
          return {
            content: [{ type: "text" as const, text: "No matching network requests." }],
          };
        }

        const lines = requests.slice(-50).map((r) => {
          const status = r.status ?? "pending";
          const duration = r.timing?.duration
            ? `${Math.round(r.timing.duration)}ms`
            : "...";
          return `${r.method} ${status} ${r.url.slice(0, 120)} [${r.resourceType}] ${duration}`;
        });

        return {
          content: [
            {
              type: "text" as const,
              text: `${requests.length} requests${requests.length > 50 ? " (showing last 50)" : ""}:\n${lines.join("\n")}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `List requests failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_get_request_detail",
    "Get full request/response details including headers and body for a specific request.",
    {
      requestId: z.string().describe("Request ID from spectra_list_network_requests"),
    },
    async ({ requestId }) => {
      try {
        const pool = requirePool();
        const bus = pool.getEventBus();
        const req = bus.getNetworkRequest(requestId);

        if (!req) {
          return {
            content: [{ type: "text" as const, text: `Request ${requestId} not found.` }],
            isError: true,
          };
        }

        // Try to get response body via CDP
        let body = "(not available)";
        try {
          const conn = await pool.getActiveConnection();
          const { body: responseBody } = await conn.client.Network.getResponseBody({
            requestId,
          });
          body =
            responseBody.length > 5000
              ? responseBody.slice(0, 5000) + `\n...(truncated, ${responseBody.length} total)`
              : responseBody;
        } catch {
          // Response body may not be available
        }

        const lines = [
          `${req.method} ${req.url}`,
          `Status: ${req.status ?? "pending"} ${req.statusText || ""}`,
          `Type: ${req.resourceType}`,
          req.mimeType ? `MIME: ${req.mimeType}` : null,
          req.timing?.duration
            ? `Duration: ${Math.round(req.timing.duration)}ms`
            : null,
          req.requestHeaders
            ? `\nRequest Headers:\n${formatHeaders(req.requestHeaders)}`
            : null,
          req.responseHeaders
            ? `\nResponse Headers:\n${formatHeaders(req.responseHeaders)}`
            : null,
          `\nResponse Body:\n${body}`,
        ]
          .filter(Boolean)
          .join("\n");

        return {
          content: [{ type: "text" as const, text: lines }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Get request detail failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_intercept_requests",
    "Set up request interception. Intercepted requests can be blocked, modified, or mocked.",
    {
      patterns: z
        .array(
          z.object({
            urlPattern: z.string().describe("URL glob pattern (e.g., '*.js', '*api/v1*')"),
            resourceType: z.string().optional().describe("Resource type to match"),
          })
        )
        .describe("Interception patterns"),
      action: z
        .enum(["log", "block"])
        .describe("Action: 'log' to observe, 'block' to prevent loading"),
    },
    async ({ patterns, action }) => {
      try {
        const pool = requirePool();
        const conn = await pool.ensureDomain("Fetch");

        const requestPatterns = patterns.map((p) => ({
          urlPattern: p.urlPattern,
          resourceType: p.resourceType,
          requestStage: "Request" as const,
        }));

        await conn.client.Fetch.enable({ patterns: requestPatterns });

        if (action === "block") {
          conn.client.Fetch.requestPaused(async ({ requestId }) => {
            await conn.client.Fetch.failRequest({
              requestId,
              errorReason: "BlockedByClient",
            });
          });
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `Interception active: ${patterns.map((p) => p.urlPattern).join(", ")} [${action}]`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Intercept failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_mock_response",
    "Set up a mock response for requests matching a URL pattern.",
    {
      urlPattern: z.string().describe("URL pattern to match (glob)"),
      statusCode: z.number().optional().describe("Response status code (default: 200)"),
      headers: z.record(z.string()).optional().describe("Response headers"),
      body: z.string().describe("Response body"),
    },
    async ({ urlPattern, statusCode, headers, body }) => {
      try {
        const pool = requirePool();
        const conn = await pool.ensureDomain("Fetch");

        await conn.client.Fetch.enable({
          patterns: [{ urlPattern, requestStage: "Request" }],
        });

        conn.client.Fetch.requestPaused(async ({ requestId }) => {
          const responseHeaders = Object.entries(headers || {}).map(
            ([name, value]) => ({ name, value })
          );

          await conn.client.Fetch.fulfillRequest({
            requestId,
            responseCode: statusCode ?? 200,
            responseHeaders,
            body: Buffer.from(body).toString("base64"),
          });
        });

        return {
          content: [
            {
              type: "text" as const,
              text: `Mock active for "${urlPattern}" -> ${statusCode ?? 200} (${body.length} bytes)`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Mock failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_clear_intercepts",
    "Remove all request interceptions and mocks.",
    {},
    async () => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        await conn.client.Fetch.disable();
        return {
          content: [{ type: "text" as const, text: "All interceptions cleared." }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Clear intercepts failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_wait_for_request",
    "Wait for a specific network request to complete.",
    {
      urlPattern: z.string().describe("URL pattern (regex) to wait for"),
      method: z.string().optional().describe("HTTP method to match"),
      timeout: z.number().optional().describe("Timeout in ms (default: 30000)"),
    },
    async ({ urlPattern, method, timeout }) => {
      try {
        const pool = requirePool();
        const bus = pool.getEventBus();
        const timeoutMs = timeout || 30000;
        const re = new RegExp(urlPattern, "i");
        const start = Date.now();

        while (Date.now() - start < timeoutMs) {
          const requests = bus.getNetworkRequests();
          const match = requests.find(
            (r) =>
              re.test(r.url) &&
              (!method || r.method.toUpperCase() === method.toUpperCase()) &&
              r.status !== undefined
          );
          if (match) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Request matched: ${match.method} ${match.status} ${match.url} (${Math.round(match.timing?.duration ?? 0)}ms)`,
                },
              ],
            };
          }
          await new Promise((r) => setTimeout(r, 100));
        }

        throw new Error(`No matching request within ${timeoutMs}ms`);
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Wait for request failed: ${error}` }],
          isError: true,
        };
      }
    }
  );
}

function formatHeaders(headers: Record<string, string>): string {
  return Object.entries(headers)
    .slice(0, 20)
    .map(([k, v]) => `  ${k}: ${String(v).slice(0, 100)}`)
    .join("\n");
}
