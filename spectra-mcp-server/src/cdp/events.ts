import type CDP from "chrome-remote-interface";
import type {
  BusEvent,
  EventCategory,
  NetworkRequest,
  ConsoleMessage,
  JSError,
} from "../types.js";
import { EVENT_BUFFER_SIZE } from "../constants.js";

export class EventBus {
  private events: BusEvent[] = [];
  private maxSize = EVENT_BUFFER_SIZE;
  private networkRequests = new Map<string, NetworkRequest>();
  private lastQueryTimestamps = new Map<string, number>();

  attachToClient(client: CDP.Client): void {
    // Network events
    client.Network.enable().then(() => {
      client.Network.requestWillBeSent(
        ({ requestId, request, timestamp, type }) => {
          const req: NetworkRequest = {
            requestId,
            url: request.url,
            method: request.method,
            resourceType: type || "Other",
            timestamp: timestamp * 1000,
            requestHeaders: request.headers as Record<string, string>,
            timing: { startTime: timestamp * 1000 },
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
            req.responseHeaders = response.headers as Record<string, string>;
            req.mimeType = response.mimeType;
            if (req.timing) {
              req.timing.endTime = timestamp * 1000;
              req.timing.duration =
                req.timing.endTime - req.timing.startTime;
            }
          }
          this.push("network", "responseReceived", { requestId, response });
        }
      );
    });

    // Console events
    client.Runtime.consoleAPICalled(({ type, args, timestamp }) => {
      const text = args
        .map((arg) => arg.value ?? arg.description ?? String(arg.type))
        .join(" ");
      const msg: ConsoleMessage = {
        level: type as ConsoleMessage["level"],
        text,
        timestamp: timestamp * 1000,
      };
      this.push("console", "consoleAPICalled", msg);
    });

    // JS errors
    client.Runtime.exceptionThrown(({ timestamp, exceptionDetails }) => {
      const err: JSError = {
        message:
          exceptionDetails.exception?.description ||
          exceptionDetails.text,
        stack: exceptionDetails.exception?.description,
        timestamp: timestamp * 1000,
        url: exceptionDetails.url,
        lineNumber: exceptionDetails.lineNumber,
        columnNumber: exceptionDetails.columnNumber,
      };
      this.push("runtime", "exceptionThrown", err);
    });

    // Page events
    client.Page.loadEventFired(({ timestamp }) => {
      this.push("page", "loadEventFired", { timestamp: timestamp * 1000 });
    });

    client.Page.domContentEventFired(({ timestamp }) => {
      this.push("page", "domContentEventFired", {
        timestamp: timestamp * 1000,
      });
    });

    client.Page.javascriptDialogOpening(({ message, type }) => {
      this.push("page", "dialogOpening", { message, type });
    });
  }

  private push(category: EventCategory, type: string, data: unknown): void {
    const event: BusEvent = {
      category,
      type,
      timestamp: Date.now(),
      data,
    };
    this.events.push(event);
    if (this.events.length > this.maxSize) {
      this.events.shift();
    }
  }

  query(options: {
    category?: EventCategory;
    type?: string;
    sinceTimestamp?: number;
    pattern?: string;
    limit?: number;
  }): BusEvent[] {
    let results = this.events;

    if (options.category) {
      results = results.filter((e) => e.category === options.category);
    }
    if (options.type) {
      results = results.filter((e) => e.type === options.type);
    }
    if (options.sinceTimestamp) {
      results = results.filter((e) => e.timestamp > options.sinceTimestamp!);
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

  querySinceLastCall(
    callerId: string,
    category?: EventCategory
  ): BusEvent[] {
    const lastTs = this.lastQueryTimestamps.get(callerId) || 0;
    const results = this.query({ category, sinceTimestamp: lastTs });
    this.lastQueryTimestamps.set(callerId, Date.now());
    return results;
  }

  getNetworkRequests(): NetworkRequest[] {
    return Array.from(this.networkRequests.values());
  }

  getNetworkRequest(requestId: string): NetworkRequest | undefined {
    return this.networkRequests.get(requestId);
  }

  getConsoleMessages(level?: ConsoleMessage["level"]): ConsoleMessage[] {
    return this.query({ category: "console" })
      .map((e) => e.data as ConsoleMessage)
      .filter((m) => !level || m.level === level);
  }

  getErrors(): JSError[] {
    return this.query({ category: "runtime", type: "exceptionThrown" }).map(
      (e) => e.data as JSError
    );
  }

  clear(): void {
    this.events = [];
    this.networkRequests.clear();
    this.lastQueryTimestamps.clear();
  }
}
