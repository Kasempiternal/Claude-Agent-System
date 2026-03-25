import type CDP from "chrome-remote-interface";
import type { ResolvedElement, BoundingBox } from "../types.js";

/**
 * Unified selector engine. Resolves a target string into a DOM element
 * using multiple strategies in priority order:
 *   1. Accessibility name (text match)
 *   2. CSS selector
 *   3. XPath
 *   4. Coordinates {x, y}
 */
export async function resolveTarget(
  client: CDP.Client,
  target: string
): Promise<ResolvedElement> {
  // Try CSS selector first (starts with #, ., [, or contains tag-like patterns)
  if (looksLikeCSS(target)) {
    const result = await resolveCSS(client, target);
    if (result) return result;
  }

  // Try XPath (starts with / or //)
  if (target.startsWith("/") || target.startsWith("(")) {
    const result = await resolveXPath(client, target);
    if (result) return result;
  }

  // Try coordinates ({x: N, y: N} or "x,y")
  const coords = parseCoords(target);
  if (coords) {
    return {
      nodeId: 0,
      backendNodeId: 0,
      boundingBox: { x: coords.x, y: coords.y, width: 1, height: 1 },
    };
  }

  // Try as accessibility name (text-based lookup)
  const axResult = await resolveByAccessibilityName(client, target);
  if (axResult) return axResult;

  // Fallback: try as CSS anyway
  const cssResult = await resolveCSS(client, target);
  if (cssResult) return cssResult;

  throw new Error(
    `Could not find element matching "${target}". Tried: accessibility name, CSS selector, XPath.`
  );
}

async function resolveCSS(
  client: CDP.Client,
  selector: string
): Promise<ResolvedElement | null> {
  try {
    const { root } = await client.DOM.getDocument({ depth: 0 });
    const { nodeId } = await client.DOM.querySelector({
      nodeId: root.nodeId,
      selector,
    });

    if (!nodeId) return null;
    return await buildResolvedElement(client, nodeId);
  } catch {
    return null;
  }
}

async function resolveXPath(
  client: CDP.Client,
  expression: string
): Promise<ResolvedElement | null> {
  try {
    const { result } = await client.Runtime.evaluate({
      expression: `document.evaluate('${expression.replace(/'/g, "\\'")}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`,
      returnByValue: false,
    });

    if (!result.objectId) return null;

    const { node } = await client.DOM.describeNode({
      objectId: result.objectId,
    });

    return await buildResolvedElement(client, node.nodeId, node.backendNodeId);
  } catch {
    return null;
  }
}

async function resolveByAccessibilityName(
  client: CDP.Client,
  name: string
): Promise<ResolvedElement | null> {
  try {
    // Use Runtime.evaluate to find elements by text content, aria-label, etc.
    const { result } = await client.Runtime.evaluate({
      expression: `
        (function() {
          const target = ${JSON.stringify(name)};
          const lower = target.toLowerCase();

          // Try aria-label match
          let el = document.querySelector('[aria-label="' + target.replace(/"/g, '\\\\"') + '"]');
          if (el) return el;

          // Try exact text content match on interactive elements
          const interactive = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"], [role="tab"], [role="menuitem"]');
          for (const e of interactive) {
            if (e.textContent?.trim() === target) return e;
          }

          // Try case-insensitive text match
          for (const e of interactive) {
            if (e.textContent?.trim().toLowerCase() === lower) return e;
          }

          // Try contains match on interactive elements
          for (const e of interactive) {
            if (e.textContent?.trim().toLowerCase().includes(lower)) return e;
          }

          // Try placeholder match
          el = document.querySelector('[placeholder="' + target.replace(/"/g, '\\\\"') + '"]');
          if (el) return el;

          // Try any element with matching text
          const all = document.querySelectorAll('*');
          for (const e of all) {
            if (e.children.length === 0 && e.textContent?.trim() === target) return e;
          }

          return null;
        })()
      `,
      returnByValue: false,
    });

    if (!result.objectId) return null;

    const { node } = await client.DOM.describeNode({
      objectId: result.objectId,
    });

    return await buildResolvedElement(client, node.nodeId, node.backendNodeId);
  } catch {
    return null;
  }
}

async function buildResolvedElement(
  client: CDP.Client,
  nodeId: number,
  backendNodeId?: number
): Promise<ResolvedElement> {
  let bnid = backendNodeId;
  if (!bnid) {
    const { node } = await client.DOM.describeNode({ nodeId });
    bnid = node.backendNodeId;
  }

  // Get bounding box via DOM.getBoxModel
  let boundingBox: BoundingBox = { x: 0, y: 0, width: 0, height: 0 };
  try {
    const { model } = await client.DOM.getBoxModel({ nodeId });
    if (model?.content) {
      const [x1, y1, x2, , , y3] = model.content;
      boundingBox = {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y3 - y1,
      };
    }
  } catch {
    // Element might not have a box model (e.g., hidden)
  }

  return {
    nodeId,
    backendNodeId: bnid!,
    boundingBox,
  };
}

function looksLikeCSS(s: string): boolean {
  return (
    s.startsWith("#") ||
    s.startsWith(".") ||
    s.startsWith("[") ||
    s.includes(">") ||
    s.includes("~") ||
    s.includes("+") ||
    /^[a-z]+(\[|#|\.|:)/.test(s) ||
    /^[a-z]+$/.test(s)
  );
}

function parseCoords(
  s: string
): { x: number; y: number } | null {
  // Try JSON format: {"x": 100, "y": 200}
  try {
    const obj = JSON.parse(s);
    if (typeof obj.x === "number" && typeof obj.y === "number") {
      return { x: obj.x, y: obj.y };
    }
  } catch {
    // Not JSON
  }

  // Try "x,y" format
  const match = s.match(/^(\d+)\s*,\s*(\d+)$/);
  if (match) {
    return { x: Number(match[1]), y: Number(match[2]) };
  }

  return null;
}
