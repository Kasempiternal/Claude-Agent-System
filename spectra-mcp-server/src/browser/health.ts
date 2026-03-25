import { HEALTH_CHECK_INTERVAL } from "../constants.js";
import { getActiveBrowser, closeBrowser, launchBrowser } from "./launcher.js";
import type { CDPPool } from "../cdp/pool.js";

let healthInterval: ReturnType<typeof setInterval> | null = null;

export function startHealthMonitor(pool: CDPPool): void {
  if (healthInterval) return;

  healthInterval = setInterval(async () => {
    const browser = getActiveBrowser();
    if (!browser) {
      stopHealthMonitor();
      return;
    }

    try {
      // Check if Chrome is alive by sending a signal
      process.kill(browser.pid, 0);
    } catch {
      // Chrome crashed — attempt recovery
      console.error("[spectra] Chrome process died, cleaning up...");
      await pool.disconnectAll();
      await closeBrowser();
      stopHealthMonitor();
    }
  }, HEALTH_CHECK_INTERVAL);
}

export function stopHealthMonitor(): void {
  if (healthInterval) {
    clearInterval(healthInterval);
    healthInterval = null;
  }
}
