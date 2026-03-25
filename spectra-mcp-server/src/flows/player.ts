import { parse } from "yaml";
import type { Flow, FlowStep } from "../types.js";

export function parseFlow(yamlContent: string): Flow {
  const doc = parse(yamlContent) as Record<string, unknown>;

  const flow: Flow = {
    name: String(doc.name || "unnamed"),
    description: doc.description ? String(doc.description) : undefined,
    baseUrl: doc.baseUrl ? String(doc.baseUrl) : undefined,
    variables: doc.variables as Record<string, string> | undefined,
    steps: [],
  };

  const rawSteps = doc.steps as Array<Record<string, unknown>> | undefined;
  if (rawSteps && Array.isArray(rawSteps)) {
    for (const step of rawSteps) {
      const action = Object.keys(step)[0];
      const params = step[action] as Record<string, unknown>;
      flow.steps.push({ action, params: params || {} });
    }
  }

  return flow;
}

export function resolveVariables(
  flow: Flow,
  overrides?: Record<string, string>
): Flow {
  const vars = { ...flow.variables, ...overrides };
  if (Object.keys(vars).length === 0) return flow;

  const resolved: Flow = {
    ...flow,
    steps: flow.steps.map((step) => ({
      action: step.action,
      params: resolveParams(step.params, vars),
    })),
  };

  if (resolved.baseUrl) {
    resolved.baseUrl = replaceVars(resolved.baseUrl, vars);
  }

  return resolved;
}

function resolveParams(
  params: Record<string, unknown>,
  vars: Record<string, string>
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      resolved[key] = replaceVars(value, vars);
    } else if (typeof value === "object" && value !== null) {
      resolved[key] = resolveParams(
        value as Record<string, unknown>,
        vars
      );
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

function replaceVars(s: string, vars: Record<string, string>): string {
  return s.replace(/\$\{(\w+)\}/g, (_, name) => vars[name] ?? `\${${name}}`);
}
