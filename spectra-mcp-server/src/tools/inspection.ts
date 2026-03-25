import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CDPPool } from "../cdp/pool.js";
import { serializeAXTree, parseAXNodes } from "../state/serializer.js";
import { stateStore } from "../state/store.js";
import { resolveTarget } from "../utils/selectors.js";

export function registerInspectionTools(
  server: McpServer,
  getPool: () => CDPPool | null
): void {
  const requirePool = () => {
    const pool = getPool();
    if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool;
  };

  server.tool(
    "spectra_get_snapshot",
    "Get LLM-friendly accessibility tree snapshot of the page. Use diffOnly=true after interactions to see only what changed (~50 tokens vs ~2000).",
    {
      diffOnly: z.boolean().optional().describe("Return only changes since last snapshot (default: false)"),
      depth: z.number().optional().describe("Max tree depth (default: unlimited)"),
      includeHidden: z.boolean().optional().describe("Include hidden elements (default: false)"),
    },
    async ({ diffOnly, depth, includeHidden }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;
        const tabId = pool.getActiveTabId()!;

        // Ensure Accessibility domain is enabled
        await pool.ensureDomain("Accessibility", tabId);

        // Get page info
        const [titleRes, urlRes] = await Promise.all([
          client.Runtime.evaluate({ expression: "document.title", returnByValue: true }),
          client.Runtime.evaluate({ expression: "window.location.href", returnByValue: true }),
        ]);

        // Get accessibility tree
        const { nodes: rawNodes } = await client.Accessibility.getFullAXTree({
          depth: depth ?? -1,
        });

        const axNodes = parseAXNodes(rawNodes as Record<string, unknown>[]);
        const text = serializeAXTree(axNodes);

        // Store for future diffing
        stateStore.setSnapshot(tabId, axNodes, text);

        if (diffOnly) {
          const last = stateStore.getLastSnapshot(tabId);
          if (last && last.text !== text) {
            // Simple text diff for now — Phase 4 will add structural diffing
            return {
              content: [
                {
                  type: "text" as const,
                  text: `# Page: ${titleRes.result.value} (${urlRes.result.value})\n# [DIFF MODE — showing full snapshot, structural diff coming in Phase 4]\n\n${text}`,
                },
              ],
            };
          }
        }

        const header = `# Page: ${titleRes.result.value} (${urlRes.result.value})\n# ${axNodes.length} nodes\n`;
        return {
          content: [{ type: "text" as const, text: header + "\n" + text }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Snapshot failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_get_element",
    "Get detailed info about a single element: properties, styles, bounding box, event listeners.",
    {
      target: z.string().describe("Element selector (CSS, XPath, accessibility name, or coordinates)"),
    },
    async ({ target }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        const element = await resolveTarget(client, target);

        // Get detailed node info
        const { node } = await client.DOM.describeNode({
          nodeId: element.nodeId,
          depth: 1,
        });

        // Get computed styles for key properties
        const { computedStyle } = await client.CSS.getComputedStyleForNode({
          nodeId: element.nodeId,
        });

        const styles = computedStyle
          .filter((s: { name: string }) =>
            ["display", "visibility", "opacity", "color", "background-color", "font-size", "font-weight", "position", "width", "height"].includes(s.name)
          )
          .map((s: { name: string; value: string }) => `${s.name}: ${s.value}`)
          .join(", ");

        // Get attributes
        const attrs = (node.attributes || [])
          .reduce((acc: Record<string, string>, _: string, i: number, arr: string[]) => {
            if (i % 2 === 0) acc[arr[i]] = arr[i + 1];
            return acc;
          }, {});

        const info = [
          `Tag: <${node.nodeName.toLowerCase()}>`,
          `NodeId: ${element.nodeId}`,
          `Bounding box: x=${element.boundingBox.x}, y=${element.boundingBox.y}, w=${element.boundingBox.width}, h=${element.boundingBox.height}`,
          Object.keys(attrs).length > 0 ? `Attributes: ${JSON.stringify(attrs)}` : null,
          styles ? `Styles: ${styles}` : null,
          node.childNodeCount !== undefined ? `Children: ${node.childNodeCount}` : null,
        ]
          .filter(Boolean)
          .join("\n");

        return {
          content: [{ type: "text" as const, text: info }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Get element failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_query_elements",
    "Find multiple elements by CSS selector, role, or text content. Returns a summary list.",
    {
      selector: z.string().optional().describe("CSS selector to match"),
      role: z.string().optional().describe("ARIA role to match"),
      text: z.string().optional().describe("Text content to match (partial)"),
      limit: z.number().optional().describe("Max results (default: 20)"),
    },
    async ({ selector, role, text, limit }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;
        const max = limit || 20;

        let expression: string;
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
          returnByValue: true,
        });

        const elements = result.value as Array<Record<string, unknown>>;
        if (!elements || elements.length === 0) {
          return {
            content: [{ type: "text" as const, text: "No matching elements found." }],
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
              type: "text" as const,
              text: `Found ${elements.length} elements:\n${lines.join("\n")}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Query failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_get_page_text",
    "Extract all visible text from the page. Fast, no DOM overhead.",
    {
      includeHidden: z.boolean().optional().describe("Include hidden text (default: false)"),
    },
    async ({ includeHidden }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const prop = includeHidden ? "innerText" : "innerText";
        const { result } = await conn.client.Runtime.evaluate({
          expression: `document.body.${prop}`,
          returnByValue: true,
        });
        return {
          content: [{ type: "text" as const, text: String(result.value || "(empty page)") }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Get text failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_get_page_html",
    "Get HTML source of the page or a specific element.",
    {
      selector: z.string().optional().describe("CSS selector (default: whole page)"),
      outerHTML: z.boolean().optional().describe("Include the element itself (default: true)"),
    },
    async ({ selector, outerHTML }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;
        const useOuter = outerHTML !== false;

        const prop = useOuter ? "outerHTML" : "innerHTML";
        const sel = selector || "document.documentElement";
        const expr = selector
          ? `document.querySelector(${JSON.stringify(selector)})?.${prop} || 'Element not found'`
          : `document.documentElement.${prop}`;

        const { result } = await client.Runtime.evaluate({
          expression: expr,
          returnByValue: true,
        });

        const html = String(result.value);
        if (html.length > 50000) {
          return {
            content: [
              {
                type: "text" as const,
                text: `HTML (truncated to 50000 chars):\n${html.slice(0, 50000)}\n\n... (${html.length - 50000} chars truncated)`,
              },
            ],
          };
        }

        return {
          content: [{ type: "text" as const, text: html }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Get HTML failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_get_computed_style",
    "Get computed CSS properties for an element.",
    {
      selector: z.string().describe("CSS selector of the element"),
      properties: z.array(z.string()).optional().describe("Specific CSS properties to get (default: all common ones)"),
    },
    async ({ selector, properties }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        const props = properties || [
          "display", "visibility", "opacity", "position",
          "width", "height", "margin", "padding",
          "color", "background-color", "font-size", "font-weight", "font-family",
          "border", "border-radius", "box-shadow",
          "overflow", "z-index", "flex-direction", "justify-content", "align-items",
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
          returnByValue: true,
        });

        if (!result.value) {
          return {
            content: [{ type: "text" as const, text: `Element not found: ${selector}` }],
            isError: true,
          };
        }

        const styles = result.value as Record<string, string>;
        const lines = Object.entries(styles)
          .filter(([, v]) => v && v !== "none" && v !== "normal" && v !== "auto")
          .map(([k, v]) => `${k}: ${v}`);

        return {
          content: [
            {
              type: "text" as const,
              text: `Computed styles for "${selector}":\n${lines.join("\n")}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Get style failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_get_page_metrics",
    "Get page performance metrics: FCP, LCP, CLS, TBT, DOM size, memory.",
    {},
    async () => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        // Get performance metrics from CDP
        await pool.ensureDomain("Performance", pool.getActiveTabId()!);
        const { metrics } = await client.Performance.getMetrics();

        const metricMap = new Map(
          metrics.map((m: { name: string; value: number }) => [m.name, m.value])
        );

        // Get Web Vitals via JS
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
          returnByValue: true,
        });

        const v = vitals.value as Record<string, unknown>;
        const lines = [
          `DOM Nodes: ${v.domNodes}`,
          `Body Size: ${Math.round(Number(v.bodySize) / 1024)}KB`,
          `DOM Content Loaded: ${Math.round(Number(v.domContentLoaded))}ms`,
          `Load Complete: ${Math.round(Number(v.loadComplete))}ms`,
          v.fcp ? `First Contentful Paint: ${Math.round(Number(v.fcp))}ms` : null,
          metricMap.has("JSHeapUsedSize")
            ? `JS Heap: ${Math.round(Number(metricMap.get("JSHeapUsedSize")!) / 1024 / 1024)}MB`
            : null,
          metricMap.has("Nodes")
            ? `Layout Nodes: ${metricMap.get("Nodes")}`
            : null,
        ]
          .filter(Boolean)
          .join("\n");

        return {
          content: [{ type: "text" as const, text: `Page Metrics:\n${lines}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Get metrics failed: ${error}` }],
          isError: true,
        };
      }
    }
  );
}
