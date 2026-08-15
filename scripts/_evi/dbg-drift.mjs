/**
 * Scroll-drift probe: dressing (typography) must drift far slower than the
 * fragment field when the chapter passes through the viewport. QA artifact only.
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
await settle(2000);

// Park the scene so its centre sits just below viewport centre → q = -0.35
await page.evaluate(() => {
  const s = document.querySelector('[data-qa="fragments-scene"]');
  const r = s.getBoundingClientRect();
  document.documentElement.scrollTop += r.top + 700;
});
await settle(600);

const tf = await page.evaluate(() => {
  const scene = document.querySelector('[data-qa="fragments-scene"]');
  const dressing = scene.querySelector(":scope > div");
  const wrapper = scene.querySelector(":scope > div:nth-child(2)");
  return {
    dressing: getComputedStyle(dressing).transform,
    wrapper: getComputedStyle(wrapper).transform,
    docH: document.documentElement.scrollHeight,
  };
});
console.log(JSON.stringify(tf, null, 1));
await browser.close();
