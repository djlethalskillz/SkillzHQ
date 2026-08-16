import puppeteer from "puppeteer-core";
import { statSync } from "node:fs";

const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const settle = (ms = 400) => new Promise((r) => setTimeout(r, ms));
async function flushFrames(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))),
      ),
  );
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "no-preference" },
]);
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 60000 });

const row = await page.evaluateHandle(() =>
  [...document.querySelectorAll("#what-i-do li button")].find((b) =>
    b.textContent.trimStart().startsWith("Fragments"),
  ),
);
await row.asElement().click();
await settle(1500);

const anchors = await page.evaluate(() => {
  const hero = document.querySelector('[data-qa="hero-scene"]');
  const hr = hero.getBoundingClientRect();
  return { heroY: window.scrollY + hr.top, travel: hr.height - window.innerHeight };
});

for (const p of [0, 0.5, 1]) {
  await page.evaluate(({ y, t, p }) => window.scrollTo(0, y + t * p), {
    y: anchors.heroY,
    t: anchors.travel,
    p,
  });
  await settle(700);
  await flushFrames(page);
  await page.screenshot({ path: `scripts/_evi/dbg-plain-${String(p).replace(".", "_")}.png` });
  console.log("p", p, "KB", Math.round(statSync(`scripts/_evi/dbg-plain-${String(p).replace(".", "_")}.png`).size / 1024));
}
await browser.close();
