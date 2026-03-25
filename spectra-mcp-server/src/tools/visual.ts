import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CDPPool } from "../cdp/pool.js";

export function registerVisualTools(
  server: McpServer,
  getPool: () => CDPPool | null
): void {
  const requirePool = () => {
    const pool = getPool();
    if (!pool) throw new Error("No browser running. Call spectra_launch_browser first.");
    return pool;
  };

  server.tool(
    "spectra_take_screenshot",
    "Capture a screenshot of the page or a specific element. Returns base64 PNG.",
    {
      selector: z.string().optional().describe("CSS selector for element screenshot (default: full page)"),
      fullPage: z.boolean().optional().describe("Capture full scrollable page (default: false)"),
      quality: z.number().optional().describe("JPEG quality 0-100 (default: PNG)"),
    },
    async ({ selector, fullPage, quality }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        let clip: { x: number; y: number; width: number; height: number; scale: number } | undefined;

        if (selector) {
          const { result } = await client.Runtime.evaluate({
            expression: `JSON.stringify(document.querySelector(${JSON.stringify(selector)})?.getBoundingClientRect())`,
            returnByValue: true,
          });
          if (result.value && result.value !== "null") {
            const rect = JSON.parse(String(result.value));
            clip = { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scale: 1 };
          }
        }

        if (fullPage) {
          const { result } = await client.Runtime.evaluate({
            expression: `JSON.stringify({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight })`,
            returnByValue: true,
          });
          const size = JSON.parse(String(result.value));
          clip = { x: 0, y: 0, width: size.width, height: size.height, scale: 1 };
        }

        const format = quality !== undefined ? "jpeg" : "png";
        const { data } = await client.Page.captureScreenshot({
          format,
          quality: quality,
          clip,
        });

        const sizeKB = Math.round((data.length * 3) / 4 / 1024);

        return {
          content: [
            {
              type: "image" as const,
              data,
              mimeType: format === "jpeg" ? "image/jpeg" : ("image/png" as const),
            },
            {
              type: "text" as const,
              text: `Screenshot captured (${format}, ~${sizeKB}KB)${selector ? ` of "${selector}"` : ""}${fullPage ? " [full page]" : ""}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Screenshot failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_compare_screenshots",
    "Compare two screenshots using pixel diff. Returns whether they match and diff percentage.",
    {
      baseline: z.string().describe("Base64 PNG of the baseline screenshot"),
      threshold: z.number().optional().describe("Acceptable diff percentage (default: 0.1)"),
    },
    async ({ baseline, threshold }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        // Take current screenshot
        const { data: current } = await client.Page.captureScreenshot({
          format: "png",
        });

        // Compare using canvas in the page
        const { result } = await client.Runtime.evaluate({
          expression: `
            (async function() {
              const baseline = ${JSON.stringify(baseline)};
              const current = ${JSON.stringify(current)};

              async function loadImage(b64) {
                return new Promise((resolve) => {
                  const img = new Image();
                  img.onload = () => resolve(img);
                  img.src = 'data:image/png;base64,' + b64;
                });
              }

              const [img1, img2] = await Promise.all([loadImage(baseline), loadImage(current)]);
              const canvas = document.createElement('canvas');
              const w = Math.max(img1.width, img2.width);
              const h = Math.max(img1.height, img2.height);
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');

              ctx.drawImage(img1, 0, 0);
              const data1 = ctx.getImageData(0, 0, w, h).data;
              ctx.clearRect(0, 0, w, h);
              ctx.drawImage(img2, 0, 0);
              const data2 = ctx.getImageData(0, 0, w, h).data;

              let diffPixels = 0;
              const totalPixels = w * h;
              for (let i = 0; i < data1.length; i += 4) {
                const dr = Math.abs(data1[i] - data2[i]);
                const dg = Math.abs(data1[i+1] - data2[i+1]);
                const db = Math.abs(data1[i+2] - data2[i+2]);
                if (dr + dg + db > 30) diffPixels++;
              }

              return { diffPercent: (diffPixels / totalPixels) * 100, diffPixels, totalPixels, width: w, height: h };
            })()
          `,
          returnByValue: true,
          awaitPromise: true,
        });

        const diff = result.value as { diffPercent: number; diffPixels: number; totalPixels: number; width: number; height: number };
        const thresholdPct = threshold ?? 0.1;
        const passed = diff.diffPercent <= thresholdPct;

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                passed,
                diffPercent: Math.round(diff.diffPercent * 100) / 100,
                diffPixels: diff.diffPixels,
                totalPixels: diff.totalPixels,
                dimensions: `${diff.width}x${diff.height}`,
                threshold: thresholdPct,
                suggestion: passed
                  ? undefined
                  : `${diff.diffPercent.toFixed(2)}% of pixels differ (threshold: ${thresholdPct}%). Use spectra_take_screenshot to capture both states and compare visually.`,
              }),
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Compare screenshots failed: ${error}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "spectra_get_bounding_boxes",
    "Get bounding rectangles for multiple elements. Useful for layout verification.",
    {
      selectors: z.array(z.string()).describe("CSS selectors to get bounding boxes for"),
    },
    async ({ selectors }) => {
      try {
        const pool = requirePool();
        const conn = await pool.getActiveConnection();
        const client = conn.client;

        const { result } = await client.Runtime.evaluate({
          expression: `
            ${JSON.stringify(selectors)}.map(sel => {
              const el = document.querySelector(sel);
              if (!el) return { selector: sel, found: false };
              const rect = el.getBoundingClientRect();
              return {
                selector: sel,
                found: true,
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                visible: el.offsetParent !== null,
              };
            })
          `,
          returnByValue: true,
        });

        const boxes = result.value as Array<{
          selector: string;
          found: boolean;
          x?: number;
          y?: number;
          width?: number;
          height?: number;
          visible?: boolean;
        }>;

        const lines = boxes.map((b) =>
          b.found
            ? `${b.selector}: (${b.x}, ${b.y}) ${b.width}x${b.height}${b.visible ? "" : " [hidden]"}`
            : `${b.selector}: NOT FOUND`
        );

        return {
          content: [
            {
              type: "text" as const,
              text: `Bounding boxes:\n${lines.join("\n")}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Get bounding boxes failed: ${error}` }],
          isError: true,
        };
      }
    }
  );
}
