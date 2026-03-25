import type CDP from "chrome-remote-interface";

// CDP connection types
export interface TabInfo {
  id: string;
  url: string;
  title: string;
  type: string;
}

export interface CDPConnection {
  client: CDP.Client;
  tabId: string;
  url: string;
  title: string;
  enabledDomains: Set<string>;
}

// Event bus types
export type EventCategory =
  | "network"
  | "console"
  | "page"
  | "dom"
  | "runtime";

export interface BusEvent {
  category: EventCategory;
  type: string;
  timestamp: number;
  data: unknown;
}

export interface NetworkRequest {
  requestId: string;
  url: string;
  method: string;
  resourceType: string;
  timestamp: number;
  status?: number;
  statusText?: string;
  responseHeaders?: Record<string, string>;
  requestHeaders?: Record<string, string>;
  mimeType?: string;
  contentLength?: number;
  timing?: {
    startTime: number;
    endTime?: number;
    duration?: number;
  };
}

export interface ConsoleMessage {
  level: "log" | "info" | "warn" | "error" | "debug";
  text: string;
  timestamp: number;
  url?: string;
  lineNumber?: number;
}

export interface JSError {
  message: string;
  stack?: string;
  timestamp: number;
  url?: string;
  lineNumber?: number;
  columnNumber?: number;
}

// Accessibility tree types
export interface AXNode {
  nodeId: string;
  role: string;
  name: string;
  value?: string;
  description?: string;
  properties?: Record<string, unknown>;
  children?: AXNode[];
  boundingBox?: BoundingBox;
  ignored?: boolean;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// State diffing types
export interface SnapshotDiff {
  type: "diff";
  added: AXNode[];
  removed: { nodeId: string; role: string; name: string }[];
  changed: {
    nodeId: string;
    property: string;
    from: unknown;
    to: unknown;
  }[];
  summary: string;
}

export interface FullSnapshot {
  type: "full";
  url: string;
  title: string;
  tree: string; // LLM-friendly text representation
  nodeCount: number;
}

// Selector types
export type SelectorStrategy = "css" | "xpath" | "axName" | "axRole" | "coords";

export interface ResolvedElement {
  nodeId: number;
  backendNodeId: number;
  objectId?: string;
  boundingBox: BoundingBox;
  role?: string;
  name?: string;
  tagName?: string;
}

// Assertion types
export interface AssertionResult {
  passed: boolean;
  assertion: string;
  target: string;
  actual: string;
  expected: string;
  suggestion?: string;
  candidates?: string[];
}

// Browser config
export interface BrowserConfig {
  headless: boolean;
  viewport: { width: number; height: number };
  userAgent?: string;
  locale?: string;
  timezone?: string;
  deviceScaleFactor?: number;
}

// Flow types
export interface FlowStep {
  action: string;
  params: Record<string, unknown>;
}

export interface Flow {
  name: string;
  description?: string;
  baseUrl?: string;
  variables?: Record<string, string>;
  steps: FlowStep[];
}

// Device presets
export interface DevicePreset {
  name: string;
  viewport: { width: number; height: number };
  deviceScaleFactor: number;
  isMobile: boolean;
  userAgent: string;
}

// Tool result helper
export interface ToolResult {
  content: { type: "text"; text: string }[];
  isError?: boolean;
}
