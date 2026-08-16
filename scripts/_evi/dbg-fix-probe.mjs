/**
 * Post-fix probe: (1) confirm served chunk contains segClear (fix live?),
 * (2) list every figure with z-index + face overlap % at two moments.
 * QA artifact only.
 */
import puppeteer from "puppeteer-core";
import { settle } from "./dbg-common.mjs";

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
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

// 1 — served chunk check
const hasSeg = await page.evaluate(async () => {
  const entries = performance.getEntriesByType("resource").map((e) => e.name);
  for (const u of entries) {
    if (!u.includes(".js")) continue;
    try {
      const r = await fetch(u);
      const t = await r.text();
      if (t.includes("segClear")) return u;
    } catch {}
  }
  return null;
});
console.log("served-chunk-with-segClear:", hasSeg);

// 2 — face overlap census at two moments
const face = (x0, y0, x1, y1, el) => {
  const hw = el.offsetWidth * 0.55 + 20;
  const hh = el.offsetHeight * 0.55 + 20;
  const ox = Math.max(0, Math.min(x1, x0 + hw) - Math.max(x0, x1 - hw) );
  return null;
};
const census = () => {
  const res = [];
  const hero = document.querySelector('[data-qa="fragments-hero-photo"]');
  const scene = document.querySelector('[data-qa="fragments-scene"]');
  const hr = hero.getBoundingClientRect();
  const sr = scene.getBoundingClientRect();
  const fx0 = hr.left - sr.left + hr.width * 0.35;
  const fx1 = hr.left - sr.left + hr.width * 0.65;
  const fy0 = hr.top - sr.top + hr.height * 0.35;
  const fy1 = hr.top - sr.top + hr.height * 0.65;
  for (const el of document.querySelectorAll('[data-qa="fragments-field"] figure')) {
    const r = el.getBoundingClientRect();
    const ox = Math.max(0, Math.min(fx1, r.right - sr.left) - Math.max(fx0, r.left - sr.left));
    const oy = Math.max(0, Math.min(fy1, r.bottom - sr.top) - Math.max(fy0, r.top - sr.top));
    const pct = (ox * oy) / ((fx1 - fx0) * (fy1 - fy0)) * 100;
    const z = getComputedStyle(el).zIndex;
    if (pct > 1) res.push({ z, pct: Math.round(pct), img: el.querySelector("img, canvas")?.src?.split("/").pop() });
  }
  return res.sort((a, b) => b.pct - a.pct);
};
await settle(5000);
console.log("t≈5s over-face:", await page.evaluate(census));
await settle(25000);
console.log("t≈30s over-face:", await page.evaluate(census));
await browser.close();
