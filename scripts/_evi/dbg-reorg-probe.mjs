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
await settle(1600);
// wait until t ~ 31s
await settle(27500);
const info = await page.evaluate(() => {
  const hero = document.querySelector('[data-qa="fragments-hero-photo"]');
  const hr = hero.getBoundingClientRect();
  const figs = [...document.querySelectorAll('[data-qa="fragments-field"] figure')].map(el => {
    const r = el.getBoundingClientRect();
    return {
      id: el.getAttribute('data-qa'), z: getComputedStyle(el).zIndex,
      op: +getComputedStyle(el).opacity,
      x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
    };
  });
  // overlap with hero rect
  const over = figs.filter(f => !(f.x + f.w <= hr.x || f.x >= hr.x + hr.width || f.y + f.h <= hr.y || f.y >= hr.y + hr.height))
                   .map(f => ({ ...f, overPct: Math.round((Math.min(f.x+f.w,hr.x+hr.width)-Math.max(f.x,hr.x))*(Math.min(f.y+f.h,hr.y+hr.height)-Math.max(f.y,hr.y)) / (hr.width*hr.height) * 100) }));
  const heroStyle = { transform: getComputedStyle(hero).transform, opacity: getComputedStyle(hero).opacity };
  return { heroRect: { x: Math.round(hr.x), y: Math.round(hr.y), w: Math.round(hr.width), h: Math.round(hr.height) }, heroStyle, over };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
