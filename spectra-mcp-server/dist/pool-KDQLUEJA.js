#!/usr/bin/env node
import {
  EVENT_BUFFER_SIZE
} from "./chunk-EAOU7X3D.js";

// src/cdp/pool.ts
import CDP2 from "chrome-remote-interface";

// src/cdp/connection.ts
import CDP from "chrome-remote-interface";
var ConnectionManager = class {
  connections = /* @__PURE__ */ new Map();
  port;
  constructor(port) {
    this.port = port;
  }
  async connect(targetId) {
    const existing = this.connections.get(targetId);
    if (existing) return existing;
    const client = await CDP({ target: targetId, port: this.port });
    await Promise.all([
      client.Page.enable(),
      client.Runtime.enable(),
      client.DOM.enable()
    ]);
    const conn = {
      client,
      tabId: targetId,
      url: "",
      title: "",
      enabledDomains: /* @__PURE__ */ new Set(["Page", "Runtime", "DOM"])
    };
    client.Page.frameNavigated(({ frame }) => {
      if (!frame.parentId) {
        conn.url = frame.url;
        conn.title = frame.name || "";
      }
    });
    this.connections.set(targetId, conn);
    return conn;
  }
  async ensureDomain(conn, domain) {
    if (conn.enabledDomains.has(domain)) return;
    const domainObj = conn.client[domain];
    if (domainObj && typeof domainObj.enable === "function") {
      await domainObj.enable();
      conn.enabledDomains.add(domain);
    }
  }
  get(targetId) {
    return this.connections.get(targetId);
  }
  getAll() {
    return Array.from(this.connections.values());
  }
  async disconnect(targetId) {
    const conn = this.connections.get(targetId);
    if (conn) {
      try {
        await conn.client.close();
      } catch {
      }
      this.connections.delete(targetId);
    }
  }
  async disconnectAll() {
    const ids = Array.from(this.connections.keys());
    await Promise.all(ids.map((id) => this.disconnect(id)));
  }
};

// src/cdp/events.ts
var EventBus = class {
  events = [];
  maxSize = EVENT_BUFFER_SIZE;
  networkRequests = /* @__PURE__ */ new Map();
  lastQueryTimestamps = /* @__PURE__ */ new Map();
  attachToClient(client) {
    client.Network.enable().then(() => {
      client.Network.requestWillBeSent(
        ({ requestId, request, timestamp, type }) => {
          const req = {
            requestId,
            url: request.url,
            method: request.method,
            resourceType: type || "Other",
            timestamp: timestamp * 1e3,
            requestHeaders: request.headers,
            timing: { startTime: timestamp * 1e3 }
          };
          this.networkRequests.set(requestId, req);
          this.push("network", "requestWillBeSent", req);
        }
      );
      client.Network.responseReceived(
        ({ requestId, response, timestamp }) => {
          const req = this.networkRequests.get(requestId);
          if (req) {
            req.status = response.status;
            req.statusText = response.statusText;
            req.responseHeaders = response.headers;
            req.mimeType = response.mimeType;
            if (req.timing) {
              req.timing.endTime = timestamp * 1e3;
              req.timing.duration = req.timing.endTime - req.timing.startTime;
            }
          }
          this.push("network", "responseReceived", { requestId, response });
        }
      );
    });
    client.Runtime.consoleAPICalled(({ type, args, timestamp }) => {
      const text = args.map((arg) => arg.value ?? arg.description ?? String(arg.type)).join(" ");
      const msg = {
        level: type,
        text,
        timestamp: timestamp * 1e3
      };
      this.push("console", "consoleAPICalled", msg);
    });
    client.Runtime.exceptionThrown(({ timestamp, exceptionDetails }) => {
      const err = {
        message: exceptionDetails.exception?.description || exceptionDetails.text,
        stack: exceptionDetails.exception?.description,
        timestamp: timestamp * 1e3,
        url: exceptionDetails.url,
        lineNumber: exceptionDetails.lineNumber,
        columnNumber: exceptionDetails.columnNumber
      };
      this.push("runtime", "exceptionThrown", err);
    });
    client.Page.loadEventFired(({ timestamp }) => {
      this.push("page", "loadEventFired", { timestamp: timestamp * 1e3 });
    });
    client.Page.domContentEventFired(({ timestamp }) => {
      this.push("page", "domContentEventFired", {
        timestamp: timestamp * 1e3
      });
    });
    client.Page.javascriptDialogOpening(({ message, type }) => {
      this.push("page", "dialogOpening", { message, type });
    });
  }
  push(category, type, data) {
    const event = {
      category,
      type,
      timestamp: Date.now(),
      data
    };
    this.events.push(event);
    if (this.events.length > this.maxSize) {
      this.events.shift();
    }
  }
  query(options) {
    let results = this.events;
    if (options.category) {
      results = results.filter((e) => e.category === options.category);
    }
    if (options.type) {
      results = results.filter((e) => e.type === options.type);
    }
    if (options.sinceTimestamp) {
      results = results.filter((e) => e.timestamp > options.sinceTimestamp);
    }
    if (options.pattern) {
      const re = new RegExp(options.pattern, "i");
      results = results.filter((e) => re.test(JSON.stringify(e.data)));
    }
    if (options.limit) {
      results = results.slice(-options.limit);
    }
    return results;
  }
  querySinceLastCall(callerId, category) {
    const lastTs = this.lastQueryTimestamps.get(callerId) || 0;
    const results = this.query({ category, sinceTimestamp: lastTs });
    this.lastQueryTimestamps.set(callerId, Date.now());
    return results;
  }
  getNetworkRequests() {
    return Array.from(this.networkRequests.values());
  }
  getNetworkRequest(requestId) {
    return this.networkRequests.get(requestId);
  }
  getConsoleMessages(level) {
    return this.query({ category: "console" }).map((e) => e.data).filter((m) => !level || m.level === level);
  }
  getErrors() {
    return this.query({ category: "runtime", type: "exceptionThrown" }).map(
      (e) => e.data
    );
  }
  clear() {
    this.events = [];
    this.networkRequests.clear();
    this.lastQueryTimestamps.clear();
  }
};

// src/cdp/pool.ts
var CDPPool = class {
  connectionManager;
  eventBuses = /* @__PURE__ */ new Map();
  activeTabId = null;
  port;
  constructor(port) {
    this.port = port;
    this.connectionManager = new ConnectionManager(port);
  }
  async listTargets() {
    const targets = await CDP2.List({ port: this.port });
    return targets.filter((t) => t.type === "page").map((t) => ({
      id: t.id,
      url: t.url,
      title: t.title,
      type: t.type
    }));
  }
  async connectToTab(targetId) {
    const conn = await this.connectionManager.connect(targetId);
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
  async getActiveConnection() {
    if (!this.activeTabId) {
      const targets = await this.listTargets();
      if (targets.length === 0) {
        throw new Error("No browser tabs available. Launch a browser first.");
      }
      this.activeTabId = targets[0].id;
    }
    return this.connectionManager.connect(this.activeTabId);
  }
  getEventBus(tabId) {
    const id = tabId || this.activeTabId;
    if (!id) throw new Error("No active tab");
    const bus = this.eventBuses.get(id);
    if (!bus) throw new Error(`No event bus for tab ${id}`);
    return bus;
  }
  async ensureDomain(domain, tabId) {
    const conn = tabId ? await this.connectionManager.connect(tabId) : await this.getActiveConnection();
    await this.connectionManager.ensureDomain(conn, domain);
    return conn;
  }
  setActiveTab(tabId) {
    this.activeTabId = tabId;
  }
  getActiveTabId() {
    return this.activeTabId;
  }
  async createTab(url) {
    const target = await CDP2.New({
      port: this.port,
      url: url || "about:blank"
    });
    return {
      id: target.id,
      url: target.url,
      title: target.title || "",
      type: target.type
    };
  }
  async closeTab(targetId) {
    await this.connectionManager.disconnect(targetId);
    this.eventBuses.get(targetId)?.clear();
    this.eventBuses.delete(targetId);
    await CDP2.Close({ port: this.port, id: targetId });
    if (this.activeTabId === targetId) {
      this.activeTabId = null;
    }
  }
  async disconnectAll() {
    await this.connectionManager.disconnectAll();
    this.eventBuses.forEach((bus) => bus.clear());
    this.eventBuses.clear();
    this.activeTabId = null;
  }
};
export {
  CDPPool
};
//# sourceMappingURL=pool-KDQLUEJA.js.map