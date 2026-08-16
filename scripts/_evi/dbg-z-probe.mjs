import puppeteer from "puppeteer-core";
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const settle = (ms=400) => new Promise(r=>setTimeout(r,ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("#what-i-do li button")].find(b => b.textContent.includes("Fragments"));
  btn.click();
});
await settle(1500);
const z = await page.evaluate(() => {
  const grab = (q) => {
    const el = document.querySelector(q);
    if (!el) return 'NOT FOUND';
    const cs = getComputedStyle(el);
    return `${cs.position} z=${cs.zIndex} class="${el.className.slice(0,60)}"`;
  };
  return {
    scene: grab('[data-qa="fragments-scene"]'),
    wrapper: grab('[data-qa="fragments-scene"] > div:nth-child(2)'),
    field: grab('[data-qa="fragments-field"]'),
    hero: grab('[data-qa="fragments-hero"]'),
    heroMount: grab('[data-qa="fragments-hero"] > div'),
    fig: grab('[data-qa="frag-frag-one-nation"]'),
    dressing: grab('[data-qa="fragments-scene"] > div:nth-child(1)'),
  };
});
console.log(JSON.stringify(z, null, 1));
await browser.close();
