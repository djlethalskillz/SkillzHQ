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

const snap = () => page.evaluate(() => {
  const s = document.querySelector('[data-qa="fragments-scene"]');
  return { t: Math.round(s.getBoundingClientRect().top * 10) / 10, y: Math.round(scrollY), docH: document.documentElement.scrollHeight };
});

console.log("t0", JSON.stringify(await snap()));
// scroll scene top to exactly 0
for (let i = 0; i < 6; i++) {
  await page.evaluate(() => {
    const s = document.querySelector('[data-qa="fragments-scene"]');
    const t = s.getBoundingClientRect().top;
    if (Math.abs(t) > 0.5) document.documentElement.scrollTop += t;
  });
  await new Promise((r) => setTimeout(r, 200));
}
console.log("after scroll", JSON.stringify(await snap()));
// poll drift for 4s
for (let i = 0; i < 20; i++) {
  await new Promise((r) => setTimeout(r, 200));
  console.log("poll", i, JSON.stringify(await snap()));
}
await browser.close();
