import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
await page.evaluate(() => {
  [...document.querySelectorAll("#what-i-do li button")].find((b) => b.textContent.includes("Fragments")).click();
});
await new Promise((r) => setTimeout(r, 2500));
const out = await page.evaluate(() => {
  const scene = document.querySelector('[data-qa="fragments-scene"]');
  const r = scene.getBoundingClientRect();
  // Elements below the scene within 200px of its bottom
  const below = [];
  for (const el of document.querySelectorAll("#what-i-do > div, #what-i-do section, main *")) {
    const b = el.getBoundingClientRect();
    if (b.top > r.bottom - 2 && b.top < r.bottom + 300 && b.width > 100) {
      below.push({
        tag: el.tagName, cls: (el.className || "").toString().slice(0, 60),
        top: Math.round(b.top), bottom: Math.round(b.bottom),
      });
    }
  }
  return {
    sceneTop: r.top, sceneBottom: r.bottom, scrollY,
    chapterTop: (() => { const c = scene.closest("[data-qa],section,div"); const cr = c.getBoundingClientRect(); return { top: cr.top, bottom: cr.bottom }; })(),
    below: below.slice(0, 8),
  };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
