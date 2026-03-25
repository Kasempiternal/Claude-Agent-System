import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CDPPool } from "../cdp/pool.js";
import {
  startRecording,
  stopRecording,
  isRecording,
  flowToYaml,
} from "../flows/recorder.js";
import { parseFlow, resolveVariables } from "../flows/player.js";

export function registerFlowTools(
  server: McpServer,
  getPool: () => CDPPool | null
): void {
  const requirePool = () => {
    const pool = getPool();
    if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool;
  };

  server.tool(
    "spectra_record_flow",
    "Start or stop recording interactions as a replayable YAML flow (like Maestro flows).",
    {
      action: z.enum(["start", "stop"]).describe("Start or stop recording"),
      flowName: z.string().optional().describe("Name for the flow (required for start)"),
    },
    async ({ action, flowName }) => {
      try {
        if (action === "start") {
          if (!flowName) throw new Error("flowName required when starting recording");
          startRecording(flowName);
          return {
            content: [
              {
                type: "text" as const,
                text: `Recording started: "${flowName}". All interactions will be captured. Call with action="stop" to finish.`,
              },
            ],
          };
        } else {
          const flow = stopRecording();
          if (!flow) {
            return {
              content: [{ type: "text" as const, text: "No recording in progress." }],
            };
          }

          const yaml = flowToYaml(flow);
          return {
            content: [
              {
                type: "text" as const,
                text: `Recording stopped: "${flow.name}" (${flow.steps.length} steps)\n\n---\n${yaml}`,
              },
            ],
          };
        }
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Record flow failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_run_flow",
    "Execute a YAML flow. Provide either a file path or inline YAML.",
    {
      flowYaml: z.string().describe("YAML flow content (inline)"),
      variables: z
        .record(z.string())
        .optional()
        .describe("Variable overrides (e.g., { USERNAME: 'admin' })"),
      stopOnError: z
        .boolean()
        .optional()
        .describe("Stop on first error (default: true)"),
    },
    async ({ flowYaml, variables, stopOnError }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        let flow = parseFlow(flowYaml);
        flow = resolveVariables(flow, variables);

        const results: Array<{
          step: number;
          action: string;
          status: "passed" | "failed";
          error?: string;
        }> = [];

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
              error: String(error),
            });
            if (shouldStop) break;
          }
        }

        const passed = results.filter((r) => r.status === "passed").length;
        const failed = results.filter((r) => r.status === "failed").length;

        const lines = results.map(
          (r) =>
            `${r.status === "passed" ? "+" : "x"} Step ${r.step}: ${r.action}${r.error ? ` - ${r.error}` : ""}`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: `Flow "${flow.name}": ${passed} passed, ${failed} failed\n\n${lines.join("\n")}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Run flow failed: ${error}` }],
          isError: true,
        };
      }
    }
  );
}

async function executeFlowStep(
  client: { Page: { navigate: (p: { url: string }) => Promise<unknown>; loadEventFired: () => Promise<unknown> }; Runtime: { evaluate: (p: { expression: string; returnByValue: boolean; awaitPromise?: boolean }) => Promise<{ result: { value: unknown } }> }; Input: { dispatchMouseEvent: (p: Record<string, unknown>) => Promise<unknown>; dispatchKeyEvent: (p: Record<string, unknown>) => Promise<unknown> }; DOM: { getDocument: (p: { depth: number }) => Promise<{ root: { nodeId: number } }>; querySelector: (p: { nodeId: number; selector: string }) => Promise<{ nodeId: number }> } },
  action: string,
  params: Record<string, unknown>
): Promise<void> {
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
      const timeout = Number(params.timeout || 10000);
      if (condition === "selector" || condition === "text") {
        const start = Date.now();
        while (Date.now() - start < timeout) {
          const expr =
            condition === "selector"
              ? `!!document.querySelector('${value.replace(/'/g, "\\'")}')`
              : `document.body.innerText.includes(${JSON.stringify(value)})`;
          const { result } = await client.Runtime.evaluate({
            expression: expr,
            returnByValue: true,
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
        returnByValue: true,
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
          returnByValue: true,
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
        returnByValue: true,
      });
      if (!result.value) throw new Error(`Not visible: ${target}`);
      break;
    }
    case "assert_text":
    case "spectra_assert_text": {
      const expected = String(params.text || params.expected || "");
      const { result } = await client.Runtime.evaluate({
        expression: `document.body.innerText`,
        returnByValue: true,
      });
      if (!String(result.value).includes(expected)) {
        throw new Error(`Text not found: "${expected}"`);
      }
      break;
    }
    case "snapshot":
    case "spectra_get_snapshot": {
      // No-op in flow execution (just a checkpoint)
      break;
    }
    default:
      throw new Error(`Unknown flow action: ${action}`);
  }
}
