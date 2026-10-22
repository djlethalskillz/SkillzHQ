import { defineConfig } from "@playwright/test";

/**
 * Local visual safety net (`npm run qa`): screenshot baselines of every locked chapter plus axe on
 * every route, against the static build in out/. Runs on this machine only; it is deliberately not part
 * of the deploy workflow. Uses the installed Google Chrome, so no browser download is needed.
 * Baselines live next to the tests (qa/*-snapshots/) and are named per platform (win32).
 */
export default defineConfig({
  testDir: "qa",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 120_000,
  expect: {
    toHaveScreenshot: { animations: "disabled", caret: "hide", scale: "css", maxDiffPixelRatio: 0.002 },
  },
  use: {
    baseURL: "http://localhost:4100",
    channel: "chrome",
    reducedMotion: "reduce",
    colorScheme: "dark",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
  webServer: {
    command: "node qa/serve.mjs out 4100",
    url: "http://localhost:4100",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
