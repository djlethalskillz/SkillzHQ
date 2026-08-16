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
const t0 = Date.now();
await settle(800);
const first = await page.evaluate(() => {
  return [...document.querySelectorAll('[data-qa="fragments-field"] figure')]
    .map(el => { const t = el.style.transform; const m = /translate3d\((-?[\d.]+)px,\s*(-?[\d.]+)px/.exec(t); return [el.getAttribute('data-qa'), m ? [+m[1], +m[2]] : null]; });
});
await settle(2000);
const second = await page.evaluate(() => {
  return [...document.querySelectorAll('[data-qa="fragments-field"] figure')]
    .map(el => { const t = el.style.transform; const m = /translate3d\((-?[\d.]+)px,\s*(-?[\d.]+)px/.exec(t); return [el.getAttribute('data-qa'), m ? [+m[1], +m[2]] : null]; });
});
const moved = first.filter(([id, a], i) => a && second[i][1] && Math.hypot(a[0]-second[i][1][0], a[1]-second[i][1][1]) > 4);
console.log('figures:', first.length, 'moving >4px in window:', moved.length);
console.log('sample offsets:', moved.slice(0, 10).map(([id, a]) => `${id}:(${a[0].toFixed(0)},${a[1].toFixed(0)})->(${second[first.indexOf([id, a])][1][0].toFixed(0)},${second[first.indexOf([id, a])][1][1].toFixed(0)})`).join(' '));
console.log('elapsed ms:', Date.now() - t0);
await browser.close();
