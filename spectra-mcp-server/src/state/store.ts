import type { AXNode, FullSnapshot } from "../types.js";

export class StateStore {
  private snapshots = new Map<string, { nodes: AXNode[]; text: string; timestamp: number }>();

  setSnapshot(tabId: string, nodes: AXNode[], text: string): void {
    this.snapshots.set(tabId, { nodes, text, timestamp: Date.now() });
  }

  getLastSnapshot(tabId: string): { nodes: AXNode[]; text: string; timestamp: number } | undefined {
    return this.snapshots.get(tabId);
  }

  clearSnapshot(tabId: string): void {
    this.snapshots.delete(tabId);
  }

  clear(): void {
    this.snapshots.clear();
  }
}

// Singleton
export const stateStore = new StateStore();
