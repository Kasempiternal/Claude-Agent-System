import type CDP from "chrome-remote-interface";

export interface FrameworkInfo {
  name: string;
  version?: string;
  meta?: string;
}

const DETECTION_SCRIPT = `
(function() {
  const frameworks = [];

  // React
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    const roots = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.getFiberRoots?.(1);
    let version = 'unknown';
    try { version = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers?.values()?.next()?.value?.version || 'unknown'; } catch {}
    frameworks.push({ name: 'React', version });
  }

  // Next.js
  if (window.__NEXT_DATA__) {
    frameworks.push({ name: 'Next.js', version: window.__NEXT_DATA__.buildId || 'unknown', meta: 'page: ' + (window.__NEXT_DATA__.page || '/') });
  }

  // Vue
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    let version = 'unknown';
    try {
      const app = window.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps?.[0];
      version = app?.version || 'unknown';
    } catch {}
    frameworks.push({ name: 'Vue', version });
  }

  // Nuxt
  if (window.__NUXT__) {
    frameworks.push({ name: 'Nuxt', version: window.__NUXT__?.config?.public?.version || 'unknown' });
  }

  // Svelte
  if (document.querySelector('[data-svelte-h]') || window.__svelte_devtools_inject) {
    frameworks.push({ name: 'Svelte', version: 'detected' });
  }

  // Angular
  if (window.ng?.getComponent || document.querySelector('[ng-version]')) {
    const version = document.querySelector('[ng-version]')?.getAttribute('ng-version') || 'unknown';
    frameworks.push({ name: 'Angular', version });
  }

  // SvelteKit
  if (document.querySelector('[data-sveltekit-hydrate]') || window.__sveltekit) {
    frameworks.push({ name: 'SvelteKit', version: 'detected' });
  }

  // Remix
  if (window.__remixContext) {
    frameworks.push({ name: 'Remix', version: 'detected' });
  }

  // Astro
  if (document.querySelector('[data-astro-cid]') || document.querySelector('astro-island')) {
    frameworks.push({ name: 'Astro', version: 'detected' });
  }

  return frameworks;
})()
`;

export async function detectFrameworks(
  client: CDP.Client
): Promise<FrameworkInfo[]> {
  const { result } = await client.Runtime.evaluate({
    expression: DETECTION_SCRIPT,
    returnByValue: true,
    awaitPromise: false,
  });

  return (result.value as FrameworkInfo[]) || [];
}
