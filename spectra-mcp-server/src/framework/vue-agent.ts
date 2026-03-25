export const VUE_TREE_SCRIPT = `
(function() {
  const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
  if (!hook || !hook.apps || hook.apps.length === 0) return null;

  const app = hook.apps[0];
  if (!app._instance) return null;

  function serializeComponent(instance, depth, maxDepth) {
    if (!instance || depth > maxDepth) return null;

    const name = instance.type?.__name || instance.type?.name || 'Anonymous';

    let props = null;
    if (instance.props && Object.keys(instance.props).length > 0) {
      try {
        props = {};
        for (const [k, v] of Object.entries(instance.props)) {
          if (typeof v === 'function') { props[k] = '[function]'; continue; }
          if (typeof v === 'object' && v !== null) { props[k] = '[object]'; continue; }
          props[k] = v;
        }
      } catch {}
    }

    let state = null;
    if (instance.setupState) {
      try {
        state = {};
        for (const [k, v] of Object.entries(instance.setupState)) {
          if (typeof v === 'function') continue;
          if (typeof v === 'object' && v !== null) {
            state[k] = v._value !== undefined ? v._value : '[reactive]';
          } else {
            state[k] = v;
          }
        }
        if (Object.keys(state).length === 0) state = null;
      } catch {}
    }

    const children = [];
    if (instance.subTree?.component) {
      const child = serializeComponent(instance.subTree.component, depth + 1, maxDepth);
      if (child) children.push(child);
    }

    // Walk VNode children
    function walkVNode(vnode) {
      if (!vnode) return;
      if (vnode.component) {
        const child = serializeComponent(vnode.component, depth + 1, maxDepth);
        if (child) children.push(child);
      }
      if (Array.isArray(vnode.children)) {
        for (const child of vnode.children) {
          if (typeof child === 'object') walkVNode(child);
        }
      }
    }

    if (instance.subTree) walkVNode(instance.subTree);

    const result = { name };
    if (props && Object.keys(props).length > 0) result.props = props;
    if (state) result.state = state;
    if (children.length > 0) result.children = children;
    return result;
  }

  return serializeComponent(app._instance, 0, DEPTH_PLACEHOLDER);
})()
`;

export function getVueTreeScript(depth: number): string {
  return VUE_TREE_SCRIPT.replace('DEPTH_PLACEHOLDER', String(depth));
}
