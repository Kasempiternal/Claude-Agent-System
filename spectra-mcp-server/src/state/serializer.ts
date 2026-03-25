import type { AXNode } from "../types.js";

/**
 * Convert raw CDP accessibility tree nodes into compact, LLM-friendly text.
 *
 * Output format:
 *   [heading level=1] "Dashboard"
 *   [navigation] "Main Nav"
 *     [link] "Home" -> /
 *     [link] "Settings" -> /settings
 *   [region] "Content Area"
 *     [button] "Submit"
 */
export function serializeAXTree(nodes: AXNode[], indent = 0): string {
  const lines: string[] = [];

  for (const node of nodes) {
    if (node.ignored) continue;
    if (shouldSkip(node)) continue;

    const line = formatNode(node, indent);
    if (line) lines.push(line);

    if (node.children && node.children.length > 0) {
      const childText = serializeAXTree(node.children, indent + 1);
      if (childText) lines.push(childText);
    }
  }

  return lines.join("\n");
}

function formatNode(node: AXNode, indent: number): string {
  const pad = "  ".repeat(indent);
  const role = node.role.toLowerCase();
  const name = node.name?.trim();

  // Skip generic containers with no meaningful name
  if (isGenericContainer(role) && !name) return "";

  let line = `${pad}[${role}`;

  // Add useful properties
  const props = formatProperties(node);
  if (props) line += ` ${props}`;

  line += "]";

  if (name) {
    line += ` "${truncate(name, 100)}"`;
  }

  if (node.value && node.value !== name) {
    line += ` value="${truncate(String(node.value), 80)}"`;
  }

  return line;
}

function formatProperties(node: AXNode): string {
  const parts: string[] = [];
  const props = node.properties || {};

  if (props.level) parts.push(`level=${props.level}`);
  if (props.checked !== undefined) parts.push(`checked=${props.checked}`);
  if (props.selected) parts.push("selected");
  if (props.expanded !== undefined) parts.push(`expanded=${props.expanded}`);
  if (props.disabled) parts.push("disabled");
  if (props.required) parts.push("required");
  if (props.readonly) parts.push("readonly");
  if (props.url) parts.push(`-> ${truncate(String(props.url), 60)}`);

  return parts.join(" ");
}

function isGenericContainer(role: string): boolean {
  return [
    "generic",
    "none",
    "presentation",
    "group",
    "div",
    "span",
  ].includes(role);
}

function shouldSkip(node: AXNode): boolean {
  const role = node.role.toLowerCase();
  // Skip invisible or purely structural roles
  return ["ignorable", "inlinecontent"].includes(role);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + "...";
}

/**
 * Parse CDP's raw accessibility tree response into our AXNode format.
 */
export function parseAXNodes(rawNodes: Record<string, unknown>[]): AXNode[] {
  const nodeMap = new Map<string, AXNode>();
  const roots: AXNode[] = [];

  for (const raw of rawNodes) {
    const nodeId = String(raw.nodeId ?? "");
    const role = extractAXValue(raw.role);
    const name = extractAXValue(raw.name);
    const value = extractAXValue(raw.value);
    const description = extractAXValue(raw.description);
    const ignored = Boolean(raw.ignored);

    const properties: Record<string, unknown> = {};
    if (Array.isArray(raw.properties)) {
      for (const prop of raw.properties as { name: string; value: { value: unknown } }[]) {
        properties[prop.name] = prop.value?.value;
      }
    }

    const node: AXNode = {
      nodeId,
      role,
      name,
      value,
      description,
      properties,
      children: [],
      ignored,
    };

    nodeMap.set(nodeId, node);

    const childIds = raw.childIds as string[] | undefined;
    if (!childIds || childIds.length === 0) {
      // Could be a root or will be linked later
    }
  }

  // Build tree from parent-child relationships
  for (const raw of rawNodes) {
    const nodeId = String(raw.nodeId ?? "");
    const parent = nodeMap.get(nodeId);
    if (!parent) continue;

    const childIds = raw.childIds as string[] | undefined;
    if (childIds) {
      for (const childId of childIds) {
        const child = nodeMap.get(childId);
        if (child) {
          parent.children!.push(child);
        }
      }
    }

    // If this node has no parent reference in any other node, it's a root
    const parentId = raw.parentId as string | undefined;
    if (!parentId || !nodeMap.has(parentId)) {
      roots.push(parent);
    }
  }

  // If no clear roots, use the first node
  if (roots.length === 0 && nodeMap.size > 0) {
    roots.push(nodeMap.values().next().value!);
  }

  return roots;
}

function extractAXValue(raw: unknown): string {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>;
    return String(obj.value ?? obj.type ?? "");
  }
  return String(raw);
}
