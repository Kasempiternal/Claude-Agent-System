import CDP from "chrome-remote-interface";
import type { CDPConnection } from "../types.js";

export class ConnectionManager {
  private connections = new Map<string, CDPConnection>();
  private port: number;

  constructor(port: number) {
    this.port = port;
  }

  async connect(targetId: string): Promise<CDPConnection> {
    const existing = this.connections.get(targetId);
    if (existing) return existing;

    const client = await CDP({ target: targetId, port: this.port });

    // Enable core domains that are always needed
    await Promise.all([
      client.Page.enable(),
      client.Runtime.enable(),
      client.DOM.enable(),
    ]);

    const conn: CDPConnection = {
      client,
      tabId: targetId,
      url: "",
      title: "",
      enabledDomains: new Set(["Page", "Runtime", "DOM"]),
    };

    // Track URL/title changes
    client.Page.frameNavigated(({ frame }) => {
      if (!frame.parentId) {
        conn.url = frame.url;
        conn.title = frame.name || "";
      }
    });

    this.connections.set(targetId, conn);
    return conn;
  }

  async ensureDomain(
    conn: CDPConnection,
    domain: string
  ): Promise<void> {
    if (conn.enabledDomains.has(domain)) return;

    const domainObj = conn.client[domain as keyof CDP.Client] as
      | { enable: () => Promise<void> }
      | undefined;
    if (domainObj && typeof domainObj.enable === "function") {
      await domainObj.enable();
      conn.enabledDomains.add(domain);
    }
  }

  get(targetId: string): CDPConnection | undefined {
    return this.connections.get(targetId);
  }

  getAll(): CDPConnection[] {
    return Array.from(this.connections.values());
  }

  async disconnect(targetId: string): Promise<void> {
    const conn = this.connections.get(targetId);
    if (conn) {
      try {
        await conn.client.close();
      } catch {
        // Chrome may have already closed the target
      }
      this.connections.delete(targetId);
    }
  }

  async disconnectAll(): Promise<void> {
    const ids = Array.from(this.connections.keys());
    await Promise.all(ids.map((id) => this.disconnect(id)));
  }
}
