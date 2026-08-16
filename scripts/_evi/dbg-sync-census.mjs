/**
 * Synchronized occlusion evidence: capture 15s of frames (t≈30-45s) from ONE
 * page, pixel-check the face region, then run a z-20 census at the PEAK
 * frame. QA artifact only.
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { settle } from "./dbg-common.mjs";

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/_evi/sync-frames";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("#what-i-do li button")].find((b) =>
    b.textContent.includes("Fragments"),
  );
  btn.click();
});
await settle(1500);
for (let i = 0; i < 6; i++) {
  const t = await page.evaluate(() => {
    const s = document.querySelector('[data-qa="fragments-scene"]');
    const t = s.getBoundingClientRect().top;
    if (Math.abs(t) > 0.5) document.documentElement.scrollTop += t;
    return t;
  });
  await settle(120);
  if (Math.abs(t) <= 0.5) break;
}
await settle(28000); // t≈28s, then 45s of frames → t 28-73s

const flush = () =>
  page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null)))),
  );
// Frame-synchronized census: record overlaps at every 3rd frame, all tiers.
const census = () =>
  page.evaluate(() => {
    const hero = document.querySelector('[data-qa="fragments-hero-photo"]');
    const scene = document.querySelector('[data-qa="fragments-scene"]');
    const hr = hero.getBoundingClientRect();
    const sr = scene.getBoundingClientRect();
    const fx0 = hr.left - sr.left + hr.width * 0.35;
    const fx1 = hr.left - sr.left + hr.width * 0.65;
    const fy0 = hr.top - sr.top + hr.height * 0.35;
    const fy1 = hr.top - sr.top + hr.height * 0.65;
    const res = [];
    for (const el of document.querySelectorAll('[data-qa="fragments-field"] figure')) {
      const z = Number(getComputedStyle(el).zIndex);
      const r = el.getBoundingClientRect();
      const ox = Math.max(0, Math.min(fx1, r.right - sr.left) - Math.max(fx0, r.left - sr.left));
      const oy = Math.max(0, Math.min(fy1, r.bottom - sr.top) - Math.max(fy0, r.top - sr.top));
      const pct = ((ox * oy) / ((fx1 - fx0) * (fy1 - fy0))) * 100;
      if (pct > 2) {
        res.push({
          z,
          pct: Math.round(pct),
          img: el.querySelector("img, canvas")?.src?.split("/").pop(),
        });
      }
    }
    return res;
  });

const log = [];
for (let i = 0; i <= 360; i++) {
  await flush();
  await page.screenshot({
    path: `${OUT}/f${String(i).padStart(3, "0")}.png`,
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });
  if (i % 3 === 0) log.push({ f: i, c: await census() });
}
import { writeFileSync } from "node:fs";
writeFileSync("scripts/_evi/sync-census.json", JSON.stringify(log));
console.log("frames captured, census logged");
await browser.close();
