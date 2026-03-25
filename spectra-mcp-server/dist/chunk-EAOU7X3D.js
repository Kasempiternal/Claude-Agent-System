#!/usr/bin/env node

// src/constants.ts
var DEFAULT_BROWSER_CONFIG = {
  headless: process.env.SPECTRA_HEADLESS !== "false",
  viewport: parseViewport(
    process.env.SPECTRA_DEFAULT_VIEWPORT || "1280x720"
  )
};
function parseViewport(s) {
  const [w, h] = s.split("x").map(Number);
  return { width: w || 1280, height: h || 720 };
}
var CHROME_FLAGS = [
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-component-extensions-with-background-pages",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-extensions",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-popup-blocking",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-sync",
  "--enable-features=NetworkService,NetworkServiceInProcess",
  "--force-color-profile=srgb",
  "--metrics-recording-only",
  "--no-first-run",
  "--password-store=basic",
  "--use-mock-keychain"
];
var DEFAULT_TIMEOUT = 3e4;
var NAVIGATION_TIMEOUT = 6e4;
var EVENT_BUFFER_SIZE = 1e3;
var HEALTH_CHECK_INTERVAL = 5e3;
var DEVICE_PRESETS = {
  "iphone-15": {
    name: "iPhone 15",
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  },
  "iphone-15-pro-max": {
    name: "iPhone 15 Pro Max",
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
    isMobile: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  },
  "pixel-8": {
    name: "Pixel 8",
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
  },
  "ipad-pro-12": {
    name: "iPad Pro 12.9",
    viewport: { width: 1024, height: 1366 },
    deviceScaleFactor: 2,
    isMobile: true,
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  },
  "desktop-1080p": {
    name: "Desktop 1080p",
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    isMobile: false,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  },
  "desktop-1440p": {
    name: "Desktop 1440p",
    viewport: { width: 2560, height: 1440 },
    deviceScaleFactor: 1,
    isMobile: false,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  }
};

export {
  DEFAULT_BROWSER_CONFIG,
  CHROME_FLAGS,
  DEFAULT_TIMEOUT,
  NAVIGATION_TIMEOUT,
  EVENT_BUFFER_SIZE,
  HEALTH_CHECK_INTERVAL,
  DEVICE_PRESETS
};
//# sourceMappingURL=chunk-EAOU7X3D.js.map