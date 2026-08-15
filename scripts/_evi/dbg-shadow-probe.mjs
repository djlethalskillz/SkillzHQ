/**
 * Shadow hypothesis probe: record every z-20 figure rect + its mount's
 * box-shadow per 3rd frame over a 15s window; correlate with face pixel diff.
 * QA artifact only.
 */
import puppeteer from "puppeteer-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { settle } from "./dbg-common.mjs";

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/_evi/shadow-frames";
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
await settle(30000); // t≈30s — mirror GIF window start

const flush = () =>
  page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null)))),
  );

const snap = () =>
  page.evaluate(() => {
    const hero = document.querySelector('[data-qa="fragments-hero-photo"]');
    const scene = document.querySelector('[data-qa="fragments-scene"]');
    const hr = hero.getBoundingClientRect();
    const sr = scene.getBoundingClientRect();
    const fx0 = hr.left - sr.left + hr.width * 0.35;
    const fx1 = hr.left - sr.left + hr.width * 0.65;
    const fy0 = hr.top - sr.top + hr.height * 0.35;
    const fy1 = hr.top - sr.top + hr.height * 0.65;
    const fronts = [];
    for (const el of document.querySelectorAll('[data-qa="fragments-field"] figure')) {
      if (Number(getComputedStyle(el).zIndex) < 20) continue;
      const r = el.getBoundingClientRect();
      const inner = el.firstElementChild;
      fronts.push({
        img: el.querySelector("img, canvas")?.src?.split("/").pop(),
        x: Math.round(r.left - sr.left),
        y: Math.round(r.top - sr.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
        shadow: inner ? getComputedStyle(inner).boxShadow.slice(0, 60) : "",
      });
    }
    return { fx0, fy0, fx1, fy1, fronts };
  });

const log = [];
for (let i = 0; i <= 120; i++) {
  await flush();
  await page.screenshot({
    path: `${OUT}/f${String(i).padStart(3, "0")}.png`,
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });
  if (i % 3 === 0) log.push({ f: i, ...(await snap()) });
}
writeFileSync("scripts/_evi/shadow-census.json", JSON.stringify(log));
console.log("frames + census logged");
await browser.close();
