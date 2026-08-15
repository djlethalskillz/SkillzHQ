/**
 * TYPOGRAPHIC FIELD probe: z-order, overflow, word census, face clearance.
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
const VW = Number(process.env.VW || 1440);
const VH = Number(process.env.VH || 900);
await page.setViewport({ width: VW, height: VH });
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

const probe = await page.evaluate(() => {
  const scene = document.querySelector('[data-qa="fragments-scene"]');
  const sr = scene.getBoundingClientRect();
  const hero = document.querySelector('[data-qa="fragments-hero-photo"]');
  const hr = hero.getBoundingClientRect();

  // 1. z-order: dressing context vs field wrapper context
  const dressing = scene.querySelector(":scope > div"); // first child = dressing
  const wrapper = scene.querySelector(":scope > div:nth-child(2)");
  const dz = Number(getComputedStyle(dressing).zIndex);
  const wz = Number(getComputedStyle(wrapper).zIndex);

  // 2. overflow
  const docOverflow = document.documentElement.scrollWidth - window.innerWidth;
  const sceneScroll = scene.scrollWidth - sr.width;

  // 3. typography census (dressing spans that are not meta lines)
  const words = [];
  for (const el of dressing.querySelectorAll("span")) {
    const t = (el.textContent || "").trim();
    if (!t || t.includes("Selected") || t.includes("·")) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const visible = cs.display !== "none" && r.width > 0 && r.height > 0;
    if (!visible) continue;
    const color = cs.color.match(/[\d.]+/g).map(Number);
    const alpha = color.length > 3 ? color[3] : 1;
    words.push({
      word: t,
      wm: cs.writingMode,
      fs: Math.round(parseFloat(cs.fontSize)),
      alpha: Math.round(alpha * 100),
      x: Math.round(r.left - sr.left),
      y: Math.round(r.top - sr.top),
      w: Math.round(r.width),
      h: Math.round(r.height),
    });
  }

  // 4. face clearance: any visible dressing span crossing the face rect
  const fx0 = hr.left - sr.left + hr.width * 0.35;
  const fx1 = hr.left - sr.left + hr.width * 0.65;
  const fy0 = hr.top - sr.top + hr.height * 0.35;
  const fy1 = hr.top - sr.top + hr.height * 0.65;
  const onFace = [];
  for (const w of words) {
    if (w.x < fx1 && w.x + w.w > fx0 && w.y < fy1 && w.y + w.h > fy0) {
      onFace.push(w.word);
    }
  }

  // 5. figure count
  const figs = document.querySelectorAll('[data-qa="fragments-field"] figure').length;

  return {
    z: { dressing: dz, wrapper: wz, behindFragments: dz < wz },
    overflow: { doc: docOverflow, scene: sceneScroll },
    figures: figs,
    words: words.length,
    wordList: words,
    faceRect: { x0: Math.round(fx0), y0: Math.round(fy0), x1: Math.round(fx1), y1: Math.round(fy1) },
    onFace,
  };
});
console.log(JSON.stringify(probe, null, 1));
await browser.close();
