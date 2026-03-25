import * as chromeLauncher from "chrome-launcher";
import { CHROME_FLAGS, DEFAULT_BROWSER_CONFIG } from "../constants.js";
import type { BrowserConfig } from "../types.js";

export interface LaunchedBrowser {
  process: chromeLauncher.LaunchedChrome;
  port: number;
  pid: number;
}

let activeBrowser: LaunchedBrowser | null = null;

export async function launchBrowser(
  config?: Partial<BrowserConfig>
): Promise<LaunchedBrowser> {
  if (activeBrowser) {
    return activeBrowser;
  }

  const mergedConfig = { ...DEFAULT_BROWSER_CONFIG, ...config };

  const chromeFlags = [...CHROME_FLAGS];
  if (mergedConfig.headless) {
    chromeFlags.push("--headless=new");
  }

  const viewport = mergedConfig.viewport;
  chromeFlags.push(`--window-size=${viewport.width},${viewport.height}`);

  if (mergedConfig.userAgent) {
    chromeFlags.push(`--user-agent=${mergedConfig.userAgent}`);
  }
  if (mergedConfig.locale) {
    chromeFlags.push(`--lang=${mergedConfig.locale}`);
  }
  if (mergedConfig.timezone) {
    chromeFlags.push(`--timezone=${mergedConfig.timezone}`);
  }

  const chrome = await chromeLauncher.launch({
    chromeFlags,
    port: 0, // Random available port
  });

  activeBrowser = {
    process: chrome,
    port: chrome.port,
    pid: chrome.pid,
  };

  return activeBrowser;
}

export async function closeBrowser(): Promise<void> {
  if (activeBrowser) {
    await activeBrowser.process.kill();
    activeBrowser = null;
  }
}

export function getActiveBrowser(): LaunchedBrowser | null {
  return activeBrowser;
}

export async function getBrowserStatus(): Promise<{
  running: boolean;
  port?: number;
  pid?: number;
}> {
  if (!activeBrowser) {
    return { running: false };
  }

  // Check if Chrome is still alive
  try {
    process.kill(activeBrowser.pid, 0);
    return {
      running: true,
      port: activeBrowser.port,
      pid: activeBrowser.pid,
    };
  } catch {
    activeBrowser = null;
    return { running: false };
  }
}
