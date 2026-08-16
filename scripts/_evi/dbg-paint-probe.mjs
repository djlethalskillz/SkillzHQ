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
for (let i=0;i<6;i++){
  const t = await page.evaluate(() => {
    const s = document.querySelector('[data-qa="fragments-scene"]');
    const t = s.getBoundingClientRect().top;
    if (Math.abs(t) > 0.5) document.documentElement.scrollTop += t;
    return t;
  });
  await settle(120);
  if (Math.abs(t) <= 0.5) break;
}
await settle(10500); // t≈12s — same moment as ACTIVE
const shotFace = async () => {
  const sy = await page.evaluate(() => document.documentElement.scrollTop);
  const b = await page.screenshot({ clip: { x: 600, y: 330 + sy, width: 240, height: 240 } });
  return Buffer.from(b);
};
const fs = await import("node:fs");
fs.writeFileSync("scripts/_evi/dbg-face-0.png", await shotFace()); // baseline t=12
await page.evaluate(() => { document.querySelector('[data-qa="fragments-hero"]').style.display = 'none'; });
await settle(50);
fs.writeFileSync("scripts/_evi/dbg-face-hero-gone.png", await shotFace()); // what's behind hero
await page.evaluate(() => { document.querySelector('[data-qa="fragments-hero"]').style.display = ''; });
await settle(50);
await page.evaluate(() => {
  [...document.querySelectorAll('[data-qa="fragments-field"] figure')].forEach(el => {
    if (getComputedStyle(el).zIndex === '20') el.style.display = 'none';
  });
});
await settle(50);
fs.writeFileSync("scripts/_evi/dbg-face-no-front.png", await shotFace()); // front figs hidden
console.log('captured');
await browser.close();
