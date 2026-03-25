import type { AXNode, SnapshotDiff } from "../types.js";

/**
 * Structural diff between two AX trees.
 * Returns only added, removed, and changed nodes — typically ~50 tokens vs ~2000 for full.
 */
export function diffAXTrees(
  oldNodes: AXNode[],
  newNodes: AXNode[]
): SnapshotDiff {
  const oldMap = flattenToMap(oldNodes);
  const newMap = flattenToMap(newNodes);

  const added: AXNode[] = [];
  const removed: { nodeId: string; role: string; name: string }[] = [];
  const changed: { nodeId: string; property: string; from: unknown; to: unknown }[] = [];

  // Find added and changed
  for (const [id, node] of newMap) {
    const oldNode = oldMap.get(id);
    if (!oldNode) {
      added.push(node);
    } else {
      if (oldNode.name !== node.name) {
        changed.push({ nodeId: id, property: "name", from: oldNode.name, to: node.name });
      }
      if (oldNode.value !== node.value) {
        changed.push({ nodeId: id, property: "value", from: oldNode.value, to: node.value });
      }
      if (oldNode.role !== node.role) {
        changed.push({ nodeId: id, property: "role", from: oldNode.role, to: node.role });
      }
      // Check key properties
      const oldProps = oldNode.properties || {};
      const newProps = node.properties || {};
      for (const key of ["checked", "selected", "expanded", "disabled"]) {
        if (oldProps[key] !== newProps[key]) {
          changed.push({ nodeId: id, property: key, from: oldProps[key], to: newProps[key] });
        }
      }
    }
  }

  // Find removed
  for (const [id, node] of oldMap) {
    if (!newMap.has(id)) {
      removed.push({ nodeId: id, role: node.role, name: node.name });
    }
  }

  const parts: string[] = [];
  if (added.length) parts.push(`${added.length} added`);
  if (removed.length) parts.push(`${removed.length} removed`);
  if (changed.length) parts.push(`${changed.length} changed`);
  const summary = parts.length > 0 ? parts.join(", ") : "no changes";

  return { type: "diff", added, removed, changed, summary };
}

export function formatDiff(diff: SnapshotDiff): string {
  const lines: string[] = [`# Diff: ${diff.summary}`];

  if (diff.added.length > 0) {
    lines.push("\n## Added:");
    for (const node of diff.added) {
      lines.push(`  + [${node.role}] "${node.name}"${node.value ? ` value="${node.value}"` : ""}`);
    }
  }

  if (diff.removed.length > 0) {
    lines.push("\n## Removed:");
    for (const node of diff.removed) {
      lines.push(`  - [${node.role}] "${node.name}"`);
    }
  }

  if (diff.changed.length > 0) {
    lines.push("\n## Changed:");
    for (const change of diff.changed) {
      lines.push(`  ~ [${change.nodeId}] ${change.property}: "${change.from}" -> "${change.to}"`);
    }
  }

  return lines.join("\n");
}

function flattenToMap(nodes: AXNode[]): Map<string, AXNode> {
  const map = new Map<string, AXNode>();

  function walk(node: AXNode) {
    if (!node.ignored) {
      // Use role+name as key for matching since nodeIds may change between snapshots
      const key = node.nodeId || `${node.role}:${node.name}`;
      map.set(key, node);
    }
    if (node.children) {
      for (const child of node.children) {
        walk(child);
      }
    }
  }

  for (const node of nodes) {
    walk(node);
  }

  return map;
}
