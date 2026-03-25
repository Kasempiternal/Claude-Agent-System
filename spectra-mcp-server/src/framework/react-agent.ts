export const REACT_TREE_SCRIPT = `
(function() {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!hook) return null;

  const roots = hook.getFiberRoots?.(1);
  if (!roots || roots.size === 0) return null;

  const root = roots.values().next().value;
  if (!root || !root.current) return null;

  function getComponentName(fiber) {
    if (!fiber.type) return null;
    return fiber.type.displayName || fiber.type.name || null;
  }

  function serializeFiber(fiber, depth, maxDepth) {
    if (!fiber || depth > maxDepth) return null;

    const name = getComponentName(fiber);
    const isComponent = fiber.tag === 0 || fiber.tag === 1 || fiber.tag === 11 || fiber.tag === 15;

    let props = null;
    if (isComponent && fiber.memoizedProps && name) {
      try {
        const p = {};
        for (const [k, v] of Object.entries(fiber.memoizedProps)) {
          if (k === 'children') continue;
          if (typeof v === 'function') { p[k] = '[function]'; continue; }
          if (typeof v === 'object' && v !== null) { p[k] = '[object]'; continue; }
          p[k] = v;
        }
        if (Object.keys(p).length > 0) props = p;
      } catch {}
    }

    let state = null;
    if (isComponent && fiber.memoizedState && name) {
      try {
        let hook = fiber.memoizedState;
        const states = [];
        let i = 0;
        while (hook && i < 5) {
          if (hook.memoizedState !== undefined && typeof hook.memoizedState !== 'function') {
            const v = hook.memoizedState;
            if (typeof v === 'object' && v !== null && v.current !== undefined) {
              states.push({ ref: typeof v.current });
            } else if (typeof v !== 'object') {
              states.push(v);
            }
          }
          hook = hook.next;
          i++;
        }
        if (states.length > 0) state = states;
      } catch {}
    }

    const children = [];
    let child = fiber.child;
    while (child) {
      const serialized = serializeFiber(child, depth + (name ? 1 : 0), maxDepth);
      if (serialized) {
        if (serialized.name || serialized.children?.length > 0) {
          children.push(serialized);
        }
      }
      child = child.sibling;
    }

    if (!name && children.length === 0) return null;
    if (!name && children.length > 0) {
      return { name: null, children };
    }

    const result = { name };
    if (props) result.props = props;
    if (state) result.state = state;
    if (children.length > 0) result.children = children;
    return result;
  }

  return serializeFiber(root.current, 0, DEPTH_PLACEHOLDER);
})()
`;

export function getReactTreeScript(depth: number, includeProps: boolean, includeState: boolean): string {
  let script = REACT_TREE_SCRIPT.replace('DEPTH_PLACEHOLDER', String(depth));
  if (!includeProps) {
    script = script.replace(/let props = null;[\s\S]*?if \(Object\.keys\(p\)\.length > 0\) props = p;/, 'let props = null;');
  }
  if (!includeState) {
    script = script.replace(/let state = null;[\s\S]*?if \(states\.length > 0\) state = states;/, 'let state = null;');
  }
  return script;
}
