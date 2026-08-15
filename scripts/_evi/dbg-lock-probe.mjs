/**
 * PRODUCTION LOCK probe — console errors, failed asset requests, horizontal
 * overflow, internal scrolling, z-order, density, reduced-motion.
 * Runs desktop + mobile. QA artifact only.
 */
import puppeteer from "puppeteer-core";
import { settle } from "./dbg-common.mjs";

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});

async function run(view, reduced) {
  const page = await browser.newPage();
  const errors = [];
  const failures = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 160));
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + String(e).slice(0, 160)));
  page.on("requestfailed", (r) =>
    failures.push(`${r.method()} ${r.url().slice(0, 140)}`),
  );
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }]);
  await page.setViewport(view);
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
    const dressing = scene.querySelector(":scope > div");
    const wrapper = scene.querySelector(":scope > div:nth-child(2)");
    const scrollables = [...scene.querySelectorAll("*")].filter((el) => {
      const oy = getComputedStyle(el).overflowY;
      return (oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1;
    });
    return {
      docOverflow: document.documentElement.scrollWidth - window.innerWidth,
      sceneOverflow: scene.scrollWidth - sr.width,
      sceneFits: scene.scrollHeight <= sr.height + 1,
      internalScrollables: scrollables.map((el) => el.tagName + "." + (el.className || "").toString().slice(0, 40)),
      zDressing: Number(getComputedStyle(dressing).zIndex),
      zWrapper: Number(getComputedStyle(wrapper).zIndex),
      figures: document.querySelectorAll('[data-qa="fragments-field"] figure').length,
      transformed: [...document.querySelectorAll('[data-qa="fragments-field"] figure')].filter(
        (el) => el.style.transform,
      ).length,
    };
  });
  console.log(JSON.stringify({ view: `${view.width}x${view.height}`, reduced, ...probe, errors, failures }, null, 1));
  await page.close();
}

await run({ width: 1440, height: 900 }, false);
await run({ width: 1024, height: 768 }, false);
await run({ width: 390, height: 844 }, false);
await run({ width: 1440, height: 900 }, true);
await browser.close();
