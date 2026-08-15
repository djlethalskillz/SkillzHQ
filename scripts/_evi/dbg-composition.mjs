/**
 * Composition census: layer distribution, front-figure spread, density.
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
await settle(12000);

const comp = await page.evaluate(() => {
  const scene = document.querySelector('[data-qa="fragments-scene"]');
  const sr = scene.getBoundingClientRect();
  const figs = [...document.querySelectorAll('[data-qa="fragments-field"] figure')];
  const tiers = { 1: 0, 5: 0, 10: 0, 20: 0 };
  const quads = { TL: 0, TR: 0, BL: 0, BR: 0, C: 0 };
  const front = [];
  for (const el of figs) {
    const z = Number(getComputedStyle(el).zIndex);
    tiers[z]++;
    const r = el.getBoundingClientRect();
    const cx = r.left - sr.left + r.width / 2;
    const cy = r.top - sr.top + r.height / 2;
    const q = cx < 720 ? (cy < 450 ? "TL" : "BL") : cy < 450 ? "TR" : "BR";
    if (q !== "TL" && q !== "TR" && q !== "BL" && q !== "BR") q = "C";
    quads[q]++;
    if (z === 20) {
      front.push({
        img: el.querySelector("img, canvas")?.src?.split("/").pop(),
        x: Math.round(cx), y: Math.round(cy), w: Math.round(r.width),
      });
    }
  }
  return { total: figs.length, tiers, quads, front };
});
console.log(JSON.stringify(comp, null, 1));
await browser.close();
