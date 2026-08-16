import puppeteer from "puppeteer-core";
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const settle = (ms=400) => new Promise(r=>setTimeout(r,ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("#what-i-do li button")].find(b => b.textContent.includes("Fragments"));
  btn.click();
});
await settle(600); // just past mount + fade-in start
const shot = async () => {
  const sy = await page.evaluate(() => document.documentElement.scrollTop);
  const b = await page.screenshot({ clip: { x: 0, y: sy, width: 1440, height: 900 } });
  return Buffer.from(b);
};
// t≈0.7s and t≈2.7s — 2s apart, right after mount. Must already be moving.
const a = await shot();
await settle(2000);
const b = await shot();
const { spawnSync } = await import("node:child_process");
const fs = await import("node:fs");
fs.writeFileSync("scripts/_evi/dbg-live-a.png", a);
fs.writeFileSync("scripts/_evi/dbg-live-b.png", b);
await browser.close();
console.log("captured");
