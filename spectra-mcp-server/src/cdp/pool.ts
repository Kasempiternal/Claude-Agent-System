import CDP from "chrome-remote-interface";
import { ConnectionManager } from "./connection.js";
import { EventBus } from "./events.js";
import type { CDPConnection, TabInfo } from "../types.js";

export class CDPPool {
  private connectionManager: ConnectionManager;
  private eventBuses = new Map<string, EventBus>();
  private activeTabId: string | null = null;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.connectionManager = new ConnectionManager(port);
  }

  async listTargets(): Promise<TabInfo[]> {
    const targets = await CDP.List({ port: this.port });
    return targets
      .filter((t: { type: string }) => t.type === "page")
      .map((t: { id: string; url: string; title: string; type: string }) => ({
        id: t.id,
        url: t.url,
        title: t.title,
        type: t.type,
      }));
  }

  async connectToTab(targetId: string): Promise<CDPConnection> {
    const conn = await this.connectionManager.connect(targetId);

    // Set up event bus for this tab if not already
    if (!this.eventBuses.has(targetId)) {
      const bus = new EventBus();
      bus.attachToClient(conn.client);
      this.eventBuses.set(targetId, bus);
    }

    if (!this.activeTabId) {
      this.activeTabId = targetId;
    }

    return conn;
  }

  async getActiveConnection(): Promise<CDPConnection> {
    if (!this.activeTabId) {
      // Connect to first available page target
      const targets = await this.listTargets();
      if (targets.length === 0) {
        throw new Error("No browser tabs available. Launch a browser first.");
      }
      this.activeTabId = targets[0].id;
    }

    return this.connectionManager.connect(this.activeTabId);
  }

  getEventBus(tabId?: string): EventBus {
    const id = tabId || this.activeTabId;
    if (!id) throw new Error("No active tab");
    const bus = this.eventBuses.get(id);
    if (!bus) throw new Error(`No event bus for tab ${id}`);
    return bus;
  }

  async ensureDomain(domain: string, tabId?: string): Promise<CDPConnection> {
    const conn = tabId
      ? await this.connectionManager.connect(tabId)
      : await this.getActiveConnection();
    await this.connectionManager.ensureDomain(conn, domain);
    return conn;
  }

  setActiveTab(tabId: string): void {
    this.activeTabId = tabId;
  }

  getActiveTabId(): string | null {
    return this.activeTabId;
  }

  async createTab(url?: string): Promise<TabInfo> {
    const target = await CDP.New({
      port: this.port,
      url: url || "about:blank",
    });
    return {
      id: target.id,
      url: target.url,
      title: target.title || "",
      type: target.type,
    };
  }

  async closeTab(targetId: string): Promise<void> {
    await this.connectionManager.disconnect(targetId);
    this.eventBuses.get(targetId)?.clear();
    this.eventBuses.delete(targetId);
    await CDP.Close({ port: this.port, id: targetId });
    if (this.activeTabId === targetId) {
      this.activeTabId = null;
    }
  }

  async disconnectAll(): Promise<void> {
    await this.connectionManager.disconnectAll();
    this.eventBuses.forEach((bus) => bus.clear());
    this.eventBuses.clear();
    this.activeTabId = null;
  }
}
