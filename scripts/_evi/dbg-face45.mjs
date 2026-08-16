/**
 * Probe at t≈40s (the sustained-occlusion window): z-20 figures over the
 * live-computed face rect, with their transforms. QA artifact only.
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
await settle(37000); // t≈37s, inside the run window (frames 9-15s = t 39-45s)

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
    const res = [];
    for (const el of document.querySelectorAll('[data-qa="fragments-field"] figure')) {
      const r = el.getBoundingClientRect();
      const ox = Math.max(0, Math.min(fx1, r.right - sr.left) - Math.max(fx0, r.left - sr.left));
      const oy = Math.max(0, Math.min(fy1, r.bottom - sr.top) - Math.max(fy0, r.top - sr.top));
      const pct = ((ox * oy) / ((fx1 - fx0) * (fy1 - fy0))) * 100;
      if (pct > 1) {
        const z = getComputedStyle(el).zIndex;
        res.push({
          z,
          pct: Math.round(pct),
          img: el.querySelector("img, canvas")?.src?.split("/").pop(),
          t: el.style.transform,
        });
      }
    }
    return res.sort((a, b) => b.pct - a.pct);
  });

for (const label of ["t≈37s", "t≈41s", "t≈44s"]) {
  console.log(label, JSON.stringify(await snap()));
  await settle(4000);
}
await browser.close();
