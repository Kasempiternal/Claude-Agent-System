import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CDPPool } from "../cdp/pool.js";
import { resolveTarget } from "../utils/selectors.js";
import { sleep } from "../utils/timing.js";

export function registerInteractionTools(
  server: McpServer,
  getPool: () => CDPPool | null
): void {
  const requirePool = () => {
    const pool = getPool();
    if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool;
  };

  server.tool(
    "spectra_click",
    "Click an element by selector, accessibility name, or coordinates.",
    {
      target: z.string().describe("Element to click (CSS selector, XPath, accessibility name, text, or 'x,y' coords)"),
      button: z.enum(["left", "right", "middle"]).optional().describe("Mouse button (default: left)"),
      clickCount: z.number().optional().describe("Number of clicks (default: 1, use 2 for double-click)"),
    },
    async ({ target, button, clickCount }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        const element = await resolveTarget(client, target);
        const cx = element.boundingBox.x + element.boundingBox.width / 2;
        const cy = element.boundingBox.y + element.boundingBox.height / 2;

        const btn = button === "right" ? "right" : button === "middle" ? "middle" : "left";
        const count = clickCount ?? 1;

        for (let i = 0; i < count; i++) {
          await client.Input.dispatchMouseEvent({
            type: "mousePressed",
            x: cx,
            y: cy,
            button: btn,
            clickCount: i + 1,
          });
          await client.Input.dispatchMouseEvent({
            type: "mouseReleased",
            x: cx,
            y: cy,
            button: btn,
            clickCount: i + 1,
          });
        }

        await sleep(100); // Brief wait for any triggered navigation/effects

        return {
          content: [
            {
              type: "text" as const,
              text: `Clicked "${target}" at (${Math.round(cx)}, ${Math.round(cy)}) [${btn}${count > 1 ? ` x${count}` : ""}]`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Click failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_type",
    "Type text into an element or the currently focused element.",
    {
      text: z.string().describe("Text to type"),
      target: z.string().optional().describe("Element to focus before typing (optional)"),
      delay: z.number().optional().describe("Delay between keystrokes in ms (default: 0)"),
      clearFirst: z.boolean().optional().describe("Clear existing text before typing (default: false)"),
    },
    async ({ text, target, delay, clearFirst }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        // Focus target if provided
        if (target) {
          const element = await resolveTarget(client, target);
          await client.DOM.focus({ nodeId: element.nodeId });
        }

        // Clear existing text if requested
        if (clearFirst) {
          await client.Input.dispatchKeyEvent({ type: "keyDown", key: "a", code: "KeyA", modifiers: 2 }); // Ctrl+A
          await client.Input.dispatchKeyEvent({ type: "keyUp", key: "a", code: "KeyA", modifiers: 2 });
          await client.Input.dispatchKeyEvent({ type: "keyDown", key: "Backspace", code: "Backspace" });
          await client.Input.dispatchKeyEvent({ type: "keyUp", key: "Backspace", code: "Backspace" });
        }

        // Type text
        const keystrokeDelay = delay ?? 0;
        for (const char of text) {
          await client.Input.dispatchKeyEvent({
            type: "keyDown",
            text: char,
          });
          await client.Input.dispatchKeyEvent({
            type: "keyUp",
            text: char,
          });
          if (keystrokeDelay > 0) {
            await sleep(keystrokeDelay);
          }
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `Typed "${text.length > 50 ? text.slice(0, 50) + "..." : text}"${target ? ` into "${target}"` : ""}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Type failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_press_key",
    "Press a keyboard key or key combination (Enter, Tab, Escape, shortcuts like Ctrl+C).",
    {
      key: z.string().describe("Key to press (e.g., 'Enter', 'Tab', 'Escape', 'a', 'ArrowDown')"),
      modifiers: z.array(z.enum(["ctrl", "shift", "alt", "meta"])).optional().describe("Modifier keys to hold"),
    },
    async ({ key, modifiers }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        let modFlag = 0;
        if (modifiers) {
          if (modifiers.includes("alt")) modFlag |= 1;
          if (modifiers.includes("ctrl")) modFlag |= 2;
          if (modifiers.includes("meta")) modFlag |= 4;
          if (modifiers.includes("shift")) modFlag |= 8;
        }

        await client.Input.dispatchKeyEvent({
          type: "keyDown",
          key,
          code: keyToCode(key),
          modifiers: modFlag,
        });
        await client.Input.dispatchKeyEvent({
          type: "keyUp",
          key,
          code: keyToCode(key),
          modifiers: modFlag,
        });

        const modStr = modifiers?.length ? modifiers.join("+") + "+" : "";
        return {
          content: [{ type: "text" as const, text: `Pressed ${modStr}${key}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Key press failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_select_option",
    "Select an option in a <select> dropdown.",
    {
      selector: z.string().describe("CSS selector of the <select> element"),
      value: z.string().optional().describe("Option value to select"),
      label: z.string().optional().describe("Option label/text to select"),
      index: z.number().optional().describe("Option index to select (0-based)"),
    },
    async ({ selector, value, label, index }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        let expression: string;
        if (value !== undefined) {
          expression = `(function() { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return 'not found'; el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('change', {bubbles: true})); return el.value; })()`;
        } else if (label !== undefined) {
          expression = `(function() { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return 'not found'; const opt = Array.from(el.options).find(o => o.text === ${JSON.stringify(label)}); if (!opt) return 'option not found'; el.value = opt.value; el.dispatchEvent(new Event('change', {bubbles: true})); return opt.text; })()`;
        } else if (index !== undefined) {
          expression = `(function() { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return 'not found'; el.selectedIndex = ${index}; el.dispatchEvent(new Event('change', {bubbles: true})); return el.options[${index}]?.text || 'selected'; })()`;
        } else {
          throw new Error("Provide value, label, or index");
        }

        const { result } = await client.Runtime.evaluate({ expression, returnByValue: true });
        return {
          content: [{ type: "text" as const, text: `Selected: ${result.value}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Select failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_check",
    "Check or uncheck a checkbox or radio button.",
    {
      selector: z.string().describe("CSS selector of the checkbox/radio"),
      checked: z.boolean().describe("Whether to check (true) or uncheck (false)"),
    },
    async ({ selector, checked }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const { result } = await conn.client.Runtime.evaluate({
          expression: `(function() { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return 'not found'; if (el.checked !== ${checked}) { el.click(); } return el.checked; })()`,
          returnByValue: true,
        });
        return {
          content: [{ type: "text" as const, text: `Checkbox ${selector}: ${result.value ? "checked" : "unchecked"}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Check failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_hover",
    "Hover over an element.",
    {
      target: z.string().describe("Element to hover (CSS selector, accessibility name, etc.)"),
    },
    async ({ target }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        const element = await resolveTarget(client, target);
        const cx = element.boundingBox.x + element.boundingBox.width / 2;
        const cy = element.boundingBox.y + element.boundingBox.height / 2;

        await client.Input.dispatchMouseEvent({
          type: "mouseMoved",
          x: cx,
          y: cy,
        });

        return {
          content: [{ type: "text" as const, text: `Hovering over "${target}" at (${Math.round(cx)}, ${Math.round(cy)})` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Hover failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_scroll",
    "Scroll the page or a specific element.",
    {
      target: z.string().optional().describe("Element to scroll (default: page)"),
      direction: z.enum(["up", "down", "left", "right"]).describe("Scroll direction"),
      amount: z.union([z.number(), z.enum(["page", "top", "bottom"])]).optional().describe("Pixels to scroll, or 'page'/'top'/'bottom' (default: 400px)"),
    },
    async ({ target, direction, amount }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        if (typeof amount === "string") {
          const expr =
            amount === "top"
              ? "window.scrollTo(0, 0)"
              : amount === "bottom"
                ? "window.scrollTo(0, document.body.scrollHeight)"
                : `window.scrollBy(0, ${direction === "up" ? "-" : ""}window.innerHeight)`;
          await client.Runtime.evaluate({ expression: expr, returnByValue: true });
        } else {
          const pixels = amount ?? 400;
          const deltaX = direction === "left" ? -pixels : direction === "right" ? pixels : 0;
          const deltaY = direction === "up" ? -pixels : direction === "down" ? pixels : 0;

          if (target) {
            await client.Runtime.evaluate({
              expression: `document.querySelector(${JSON.stringify(target)})?.scrollBy(${deltaX}, ${deltaY})`,
              returnByValue: true,
            });
          } else {
            await client.Input.dispatchMouseEvent({
              type: "mouseWheel",
              x: 640,
              y: 360,
              deltaX,
              deltaY,
            });
          }
        }

        return {
          content: [{ type: "text" as const, text: `Scrolled ${direction} ${amount ?? "400px"}${target ? ` in "${target}"` : ""}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Scroll failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_drag_drop",
    "Drag an element from source to target.",
    {
      source: z.string().describe("Source element (CSS selector or accessibility name)"),
      target: z.string().describe("Target element or destination"),
    },
    async ({ source, target: targetSel }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        const srcEl = await resolveTarget(client, source);
        const tgtEl = await resolveTarget(client, targetSel);

        const sx = srcEl.boundingBox.x + srcEl.boundingBox.width / 2;
        const sy = srcEl.boundingBox.y + srcEl.boundingBox.height / 2;
        const tx = tgtEl.boundingBox.x + tgtEl.boundingBox.width / 2;
        const ty = tgtEl.boundingBox.y + tgtEl.boundingBox.height / 2;

        await client.Input.dispatchMouseEvent({ type: "mousePressed", x: sx, y: sy, button: "left" });
        await sleep(50);
        await client.Input.dispatchMouseEvent({ type: "mouseMoved", x: tx, y: ty });
        await sleep(50);
        await client.Input.dispatchMouseEvent({ type: "mouseReleased", x: tx, y: ty, button: "left" });

        return {
          content: [{ type: "text" as const, text: `Dragged "${source}" to "${targetSel}"` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Drag/drop failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_upload_file",
    "Upload a file to a file input element.",
    {
      selector: z.string().describe("CSS selector of the <input type='file'> element"),
      filePath: z.string().describe("Absolute path to the file to upload"),
    },
    async ({ selector, filePath }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        const { root } = await client.DOM.getDocument({ depth: 0 });
        const { nodeId } = await client.DOM.querySelector({ nodeId: root.nodeId, selector });
        if (!nodeId) throw new Error(`Element not found: ${selector}`);

        await client.DOM.setFileInputFiles({
          nodeId,
          files: [filePath],
        });

        return {
          content: [{ type: "text" as const, text: `Uploaded "${filePath}" to ${selector}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Upload failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_handle_dialog",
    "Accept or dismiss a JavaScript dialog (alert, confirm, prompt).",
    {
      action: z.enum(["accept", "dismiss"]).describe("Accept or dismiss the dialog"),
      promptText: z.string().optional().describe("Text to enter for prompt dialogs"),
    },
    async ({ action, promptText }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();

        await conn.client.Page.handleJavaScriptDialog({
          accept: action === "accept",
          promptText,
        });

        return {
          content: [{ type: "text" as const, text: `Dialog ${action}ed${promptText ? ` with text "${promptText}"` : ""}` }],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Handle dialog failed: ${error}` }],
          isError: true,
        };
      }
    }
  );
}

function keyToCode(key: string): string {
  const map: Record<string, string> = {
    Enter: "Enter",
    Tab: "Tab",
    Escape: "Escape",
    Backspace: "Backspace",
    Delete: "Delete",
    ArrowUp: "ArrowUp",
    ArrowDown: "ArrowDown",
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight",
    Home: "Home",
    End: "End",
    PageUp: "PageUp",
    PageDown: "PageDown",
    Space: "Space",
    " ": "Space",
  };
  return map[key] || `Key${key.toUpperCase()}`;
}
