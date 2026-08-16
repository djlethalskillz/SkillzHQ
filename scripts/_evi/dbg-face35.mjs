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
await settle(34000); // t≈35s
const info = await page.evaluate(() => {
  const hero = document.querySelector('[data-qa="fragments-hero-photo"]');
  const hr = hero.getBoundingClientRect();
  const fx0 = hr.x + hr.width*0.2, fx1 = hr.x + hr.width*0.8;
  const fy0 = hr.y + hr.height*0.2, fy1 = hr.y + hr.height*0.8;
  const figs = [...document.querySelectorAll('[data-qa="fragments-field"] figure')].map(el => {
    const r = el.getBoundingClientRect();
    return { id: el.getAttribute('data-qa').replace('frag-',''), z: getComputedStyle(el).zIndex,
      facePct: Math.round(
        Math.max(0, Math.min(r.x+r.width, fx1) - Math.max(r.x, fx0)) *
        Math.max(0, Math.min(r.y+r.height, fy1) - Math.max(r.y, fy0)) / ((fx1-fx0)*(fy1-fy0)) * 100) };
  }).filter(f => f.facePct > 0).sort((a,b) => b.facePct - a.facePct);
  return { over: figs, heroZ: getComputedStyle(hero.parentElement.parentElement).zIndex };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
