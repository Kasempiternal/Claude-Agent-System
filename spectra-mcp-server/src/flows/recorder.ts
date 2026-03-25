import { stringify } from "yaml";
import type { FlowStep, Flow } from "../types.js";

let recording = false;
let currentFlow: Flow | null = null;

export function startRecording(name: string): void {
  recording = true;
  currentFlow = {
    name,
    description: `Flow recorded at ${new Date().toISOString()}`,
    steps: [],
  };
}

export function stopRecording(): Flow | null {
  recording = false;
  const flow = currentFlow;
  currentFlow = null;
  return flow;
}

export function isRecording(): boolean {
  return recording;
}

export function recordStep(action: string, params: Record<string, unknown>): void {
  if (!recording || !currentFlow) return;
  currentFlow.steps.push({ action, params });
}

export function flowToYaml(flow: Flow): string {
  const doc: Record<string, unknown> = {
    name: flow.name,
    description: flow.description,
  };
  if (flow.baseUrl) doc.baseUrl = flow.baseUrl;
  if (flow.variables) doc.variables = flow.variables;

  const steps = flow.steps.map((step) => {
    // Simplify step representation
    const s: Record<string, unknown> = { [step.action]: step.params };
    return s;
  });

  return stringify({ ...doc, steps }, { lineWidth: 120 });
}
