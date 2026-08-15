/**
 * Airtight render proof: pause the live video at t, screenshot the element,
 * compare against the same frame extracted from the approved file with ffmpeg.
 */
import puppeteer from "puppeteer-core";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const URL = "http://localhost:3000";
const T = 3.0;
const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-extensions"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });

const btn = await page.evaluateHandle(() =>
  [...document.querySelectorAll("#what-i-do li button")].find((b) =>
    b.textContent.includes("Speaking"),
  ),
);
await btn.asElement().click();
await new Promise((r) => setTimeout(r, 3000));

const info = await page.evaluate((t) => {
  const v = document.querySelector("#speaking-archive-panel video");
  v.pause();
  v.currentTime = t;
  return new Promise((resolve) => {
    v.onseeked = () =>
      resolve({
        currentSrc: v.currentSrc,
        time: v.currentTime,
        w: v.videoWidth,
        h: v.videoHeight,
        rect: (() => {
          const r = v.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        })(),
      });
    v.onseeked = undefined;
    // seeked fires async; wait for it
    setTimeout(() => {
      const r = v.getBoundingClientRect();
      resolve({
        currentSrc: v.currentSrc,
        time: v.currentTime,
        w: v.videoWidth,
        h: v.videoHeight,
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      });
    }, 800);
  });
}, T);

await new Promise((r) => setTimeout(r, 1200));
const el = await page.$("#speaking-archive-panel video");
await el.screenshot({ path: "scripts/speaking-live-element.png" });

// extract same frame from the approved file on disk
execFileSync(
  "ffmpeg",
  [
    "-y", "-ss", String(T),
    "-i", "public/assets/speaking/SPEAKING_LIVING_LOOP.mp4",
    "-frames:v", "1",
    "scripts/speaking-file-frame.png",
  ],
  { stdio: "ignore" },
);

// scale file frame to the element's rendered size and compare via python
execFileSync(
  "python",
  [
    "-c",
    `
from PIL import Image
import sys
el = Image.open('scripts/speaking-live-element.png').convert('RGB')
frame = Image.open('scripts/speaking-file-frame.png').convert('RGB')
print('element size:', el.size)
print('file frame size:', frame.size)
el2 = el.resize(frame.size)
import math
pairs = list(zip(el2.getdata(), frame.getdata()))
diff = sum(sum(abs(a-b) for a,b in zip(p,q)) for p,q in pairs) / len(pairs)
print('mean abs pixel diff:', round(diff, 2), '(0-765 scale; <15 = same image)')
same = diff < 15
print('MATCH:', same)
`,
  ],
  { stdio: "inherit" },
);

await browser.close();
console.log("DONE", JSON.stringify(info));
