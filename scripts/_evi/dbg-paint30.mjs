/**
 * Paint-order probe at t≈30s when z-10/z-5 figures geometrically overlap the
 * face: hide hero / hide z-20 / hide z-5+10 and measure face-zone diffs vs
 * baseline. Tells WHO paints the face pixels. QA artifact only.
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
const OUT = "scripts/_evi";
const shot = (path) =>
  page.screenshot({
    path,
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });
const flush = () =>
  page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null)))),
  );

const hide = (sel) =>
  page.evaluate((s) => {
    for (const el of document.querySelectorAll(s)) el.style.visibility = "hidden";
  }, sel);
const unhide = (sel) =>
  page.evaluate((s) => {
    for (const el of document.querySelectorAll(s)) el.style.visibility = "";
  }, sel);

const census = await page.evaluate(() => {
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
    const r = el.getBoundingClientRect();
    const ox = Math.max(0, Math.min(fx1, r.right - sr.left) - Math.max(fx0, r.left - sr.left));
    const oy = Math.max(0, Math.min(fy1, r.bottom - sr.top) - Math.max(fy0, r.top - sr.top));
    const pct = ((ox * oy) / ((fx1 - fx0) * (fy1 - fy0))) * 100;
    if (pct > 1) {
      const z = getComputedStyle(el).zIndex;
      const img = el.querySelector("img, canvas");
      res.push({ z, pct: Math.round(pct), img: img?.src?.split("/").pop() });
    }
  }
  return { heroRect: { l: hr.left - sr.left, t: hr.top - sr.top, w: hr.width, h: hr.height }, res };
});
console.log("hero rect + over-face census:", JSON.stringify(census));

await settle(4000);
await flush();
await shot(`${OUT}/dbg-paint30-base.png`);

await hide('[data-qa="fragments-hero-photo"]');
await flush();
await shot(`${OUT}/dbg-paint30-herohidden.png`);
await unhide('[data-qa="fragments-hero-photo"]');

await hide('[data-qa="fragments-field"] figure'); // ALL figures
await flush();
await shot(`${OUT}/dbg-paint30-allhidden.png`);
await unhide('[data-qa="fragments-field"] figure');

await browser.close();
console.log("shots done");
