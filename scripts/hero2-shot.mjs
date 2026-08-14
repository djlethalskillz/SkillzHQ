// Hero 2 QA screenshot helper — puppeteer-core + local Chrome.
// Usage: node scripts/hero2-shot.mjs <width> <height> <out.png>
import puppeteer from "puppeteer-core";

const [w, h, out] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-first-run", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);
