/**
 * MOTION PROOF PROBE — resolves the "screenshot looked static" discrepancy
 * with hard numbers: consecutive-frame pixel diffs + DOM transform deltas.
 * QA artifact only. No source changes.
 */
import puppeteer from "puppeteer-core";
import { writeFileSync } from "node:fs";

const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const settle = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const OUT = "scripts/_evi/motion-proof";

async function openScene(page) {
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#what-i-do li button")].find((b) =>
      b.textContent.includes("Fragments"),
    );
    btn.click();
  });
  await settle(1500);
  for (let i = 0; i < 6; i++) {
    const top = await page.evaluate(() => {
      const s = document.querySelector('[data-qa="fragments-scene"]');
      const t = s.getBoundingClientRect().top;
      if (Math.abs(t) > 0.5) document.documentElement.scrollTop += t;
      return t;
    });
    await settle(120);
    if (Math.abs(top) <= 0.5) break;
  }
  await settle(2600); // entrance settle well past
}

const transforms = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('[data-qa="fragments-field"] figure')].map((f) => {
      const t = f.style.transform || "";
      const m = t.match(/translate3d\((-?[\d.]+)px,\s*(-?[\d.]+)px/);
      return { id: f.dataset.qa, x: m ? +m[1] : 0, y: m ? +m[2] : 0 };
    }),
  );

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
await page.setViewport({ width: 1440, height: 900 });
await openScene(page);

const T = 10; // 10 snapshots, 2s apart = 20s of continuous motion
const t0 = await transforms();
const shots = [];
for (let i = 0; i < T; i++) {
  const sy = await page.evaluate(() => document.documentElement.scrollTop);
  await page.screenshot({
    path: `${OUT}-${String(i).padStart(2, "0")}.png`,
    clip: { x: 0, y: sy, width: 1440, height: 900 },
  });
  shots.push({ t: i * 2 });
  await settle(2000);
}
const t1 = await transforms();

const delta = (a, b) => {
  const m = new Map(a.map((f) => [f.id, f]));
  let total = 0,
    moved = 0,
    maxD = 0,
    maxId = "";
  for (const f of b) {
    const g = m.get(f.id);
    if (!g) continue;
    const d = Math.hypot(f.x - g.x, f.y - g.y);
    total += d;
    if (d > 0.5) moved++;
    if (d > maxD) { maxD = d; maxId = f.id; }
  }
  return { count: b.length, moved, maxD, maxId, mean: b.length ? total / b.length : 0 };
};

writeFileSync(
  "scripts/_evi/motion-proof-report.json",
  JSON.stringify(
    {
      viewport: "1440x900",
      span: `${(T - 1) * 2}s`,
      fragmentMotion: {
        t0_to_t1: delta(t0, t1),
        sampleIds: t0.slice(0, 6).map((f) => ({ id: f.id, x0: f.x, y0: f.y })),
      },
    },
    null,
    2,
  ),
);
console.log("DOM delta t0→t20s:", JSON.stringify(delta(t0, t1)));
console.log("stills:", shots.length, "every 2s, 20s span — pixel diff to be computed by PIL");
await browser.close();
