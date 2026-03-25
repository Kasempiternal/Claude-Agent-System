import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CDPPool } from "../cdp/pool.js";
import { detectFrameworks } from "../framework/detector.js";
import { getReactTreeScript } from "../framework/react-agent.js";
import { getVueTreeScript } from "../framework/vue-agent.js";

export function registerFrameworkTools(
  server: McpServer,
  getPool: () => CDPPool | null
): void {
  const requirePool = () => {
    const pool = getPool();
    if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool;
  };

  server.tool(
    "spectra_detect_framework",
    "Detect frontend frameworks: React, Vue, Svelte, Angular, Next.js, Nuxt, SvelteKit, Remix, Astro.",
    {},
    async () => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const frameworks = await detectFrameworks(conn.client);

        if (frameworks.length === 0) {
          return {
            content: [{ type: "text" as const, text: "No known frameworks detected on this page." }],
          };
        }

        const lines = frameworks.map(
          (f) => `${f.name} v${f.version || "unknown"}${f.meta ? ` (${f.meta})` : ""}`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: `Detected frameworks:\n${lines.join("\n")}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Framework detection failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_get_component_tree",
    "Get the React/Vue component hierarchy with props and state. Requires React/Vue DevTools hooks.",
    {
      depth: z.number().optional().describe("Max tree depth (default: 10)"),
      includeProps: z.boolean().optional().describe("Include component props (default: true)"),
      includeState: z.boolean().optional().describe("Include component state (default: true)"),
    },
    async ({ depth, includeProps, includeState }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        // Detect which framework to use
        const frameworks = await detectFrameworks(client);
        const hasReact = frameworks.some((f) => f.name === "React");
        const hasVue = frameworks.some((f) => f.name === "Vue");

        let tree: unknown = null;
        let framework = "";

        if (hasReact) {
          const script = getReactTreeScript(
            depth ?? 10,
            includeProps !== false,
            includeState !== false
          );
          const { result } = await client.Runtime.evaluate({
            expression: script,
            returnByValue: true,
          });
          tree = result.value;
          framework = "React";
        } else if (hasVue) {
          const script = getVueTreeScript(depth ?? 10);
          const { result } = await client.Runtime.evaluate({
            expression: script,
            returnByValue: true,
          });
          tree = result.value;
          framework = "Vue";
        } else {
          // Try Svelte (basic)
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
            returnByValue: true,
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
                type: "text" as const,
                text: "No component tree available. Ensure the page uses React, Vue, or Svelte with DevTools hooks enabled.",
              },
            ],
          };
        }

        const formatted = formatComponentTree(tree, 0);
        return {
          content: [
            {
              type: "text" as const,
              text: `${framework} Component Tree:\n${formatted}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Get component tree failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_get_component_state",
    "Get props and state of a specific component by name.",
    {
      componentName: z.string().describe("Component name to find"),
    },
    async ({ componentName }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        // Search in React fiber tree
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
          returnByValue: true,
        });

        if (!result.value) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Component "${componentName}" not found in the React tree.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result.value, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Get component state failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_trigger_component_update",
    "Force a component state change (React only). Triggers a re-render.",
    {
      componentName: z.string().describe("Component name to update"),
      stateUpdate: z.string().describe("JSON string of the state update to apply"),
    },
    async ({ componentName, stateUpdate }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
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
          returnByValue: true,
        });

        return {
          content: [{ type: "text" as const, text: String(result.value) }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Trigger update failed: ${error}` }],
          isError: true,
        };
      }
    }
  );
}

function formatComponentTree(node: unknown, depth: number): string {
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;
  const pad = "  ".repeat(depth);
  const lines: string[] = [];

  if (n.name) {
    let line = `${pad}<${n.name}`;
    if (n.props && typeof n.props === "object") {
      const props = Object.entries(n.props as Record<string, unknown>)
        .slice(0, 5)
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join(" ");
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
