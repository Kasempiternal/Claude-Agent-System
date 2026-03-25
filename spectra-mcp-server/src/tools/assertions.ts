import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CDPPool } from "../cdp/pool.js";
import { resolveTarget } from "../utils/selectors.js";

export function registerAssertionTools(
  server: McpServer,
  getPool: () => CDPPool | null
): void {
  const requirePool = () => {
    const pool = getPool();
    if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool;
  };

  server.tool(
    "spectra_assert_visible",
    "Assert that an element is visible on the page. Returns structured result with suggestion on failure.",
    {
      target: z.string().describe("Element to check (CSS selector, accessibility name, text)"),
      timeout: z.number().optional().describe("Time to wait for element (default: 5000ms)"),
    },
    async ({ target, timeout }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;
        const timeoutMs = timeout || 5000;
        const start = Date.now();

        // Poll for element visibility
        while (Date.now() - start < timeoutMs) {
          try {
            const element = await resolveTarget(client, target);
            if (element.boundingBox.width > 0 && element.boundingBox.height > 0) {
              return {
                content: [
                  {
                    type: "text" as const,
                    text: JSON.stringify({
                      passed: true,
                      assertion: "assert_visible",
                      target,
                      actual: `Element visible at (${element.boundingBox.x}, ${element.boundingBox.y}), ${element.boundingBox.width}x${element.boundingBox.height}`,
                      expected: "Element is visible",
                    }),
                  },
                ],
              };
            }
          } catch {
            // Element not found yet, keep polling
          }
          await new Promise((r) => setTimeout(r, 200));
        }

        // Failed — find similar elements for suggestion
        const { result: candidates } = await client.Runtime.evaluate({
          expression: `
            Array.from(document.querySelectorAll('button, a, input, [role], h1, h2, h3, p, span'))
              .filter(el => el.offsetParent !== null)
              .map(el => el.textContent?.trim()?.slice(0, 60) || el.getAttribute('aria-label') || el.tagName.toLowerCase())
              .filter(Boolean)
              .slice(0, 10)
          `,
          returnByValue: true,
        });

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                passed: false,
                assertion: "assert_visible",
                target,
                actual: "Element not found or not visible",
                expected: "Element is visible",
                suggestion: `Element "${target}" not found after ${timeoutMs}ms. Try spectra_get_snapshot to see what's on the page, or use a different selector.`,
                candidates: (candidates.value as string[]) || [],
              }),
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Assert visible failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_assert_text",
    "Assert text content matches on the page or in an element. Returns structured result.",
    {
      target: z.string().optional().describe("Element to check (default: whole page body)"),
      text: z.string().describe("Text to match"),
      operator: z
        .enum(["equals", "contains", "matches"])
        .optional()
        .describe("Match operator (default: contains)"),
    },
    async ({ target, text, operator }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;
        const op = operator || "contains";

        const expr = target
          ? `document.querySelector(${JSON.stringify(target)})?.textContent?.trim() || ''`
          : `document.body.innerText`;

        const { result } = await client.Runtime.evaluate({
          expression: expr,
          returnByValue: true,
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
          ...(passed
            ? {}
            : {
                suggestion: `Text "${text}" not found. The actual text ${target ? `of "${target}"` : "on the page"} starts with: "${actual.slice(0, 100)}..."`,
              }),
        };

        return {
          content: [{ type: "text" as const, text: JSON.stringify(response) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Assert text failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_assert_page_state",
    "Run multiple assertions at once. Returns structured results for each.",
    {
      assertions: z
        .array(
          z.object({
            type: z.enum(["visible", "text", "url", "title", "count"]).describe("Assertion type"),
            target: z.string().optional().describe("Selector or target"),
            expected: z.string().describe("Expected value"),
          })
        )
        .describe("Array of assertions to check"),
    },
    async ({ assertions }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;
        const results: Array<{ type: string; passed: boolean; actual: string; expected: string; suggestion?: string }> = [];

        for (const assertion of assertions) {
          switch (assertion.type) {
            case "visible": {
              try {
                const element = await resolveTarget(client, assertion.target || assertion.expected);
                results.push({
                  type: "visible",
                  passed: element.boundingBox.width > 0,
                  actual: element.boundingBox.width > 0 ? "visible" : "hidden",
                  expected: assertion.expected,
                });
              } catch {
                results.push({
                  type: "visible",
                  passed: false,
                  actual: "not found",
                  expected: assertion.expected,
                  suggestion: "Element not found. Check your selector.",
                });
              }
              break;
            }
            case "text": {
              const expr = assertion.target
                ? `document.querySelector(${JSON.stringify(assertion.target)})?.textContent?.trim() || ''`
                : `document.body.innerText`;
              const { result } = await client.Runtime.evaluate({ expression: expr, returnByValue: true });
              const actual = String(result.value || "");
              results.push({
                type: "text",
                passed: actual.includes(assertion.expected),
                actual: actual.slice(0, 100),
                expected: assertion.expected,
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
                expected: assertion.expected,
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
                expected: assertion.expected,
              });
              break;
            }
            case "count": {
              const { result } = await client.Runtime.evaluate({
                expression: `document.querySelectorAll(${JSON.stringify(assertion.target || "*")}).length`,
                returnByValue: true,
              });
              const actual = Number(result.value);
              const expected = Number(assertion.expected);
              results.push({
                type: "count",
                passed: actual === expected,
                actual: String(actual),
                expected: assertion.expected,
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
              type: "text" as const,
              text: JSON.stringify({ allPassed, summary, results }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Assert page state failed: ${error}` }],
          isError: true,
        };
      }
    }
  );
}
