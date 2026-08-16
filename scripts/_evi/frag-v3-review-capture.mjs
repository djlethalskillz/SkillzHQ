/**
 * FRAGMENTS V3 — FOCUSED VISUAL REVIEW CAPTURE (QA-only, no source edits).
 *
 * Captures ONLY the Fragments interaction at the 5 review states, viewport
 * only:
 *   1. HERO REST       p = 0
 *   2. HERO EARLY      p ≈ 0.15
 *   3. HERO MID        p ≈ 0.5
 *   4. HERO TRANSITION p ≈ 0.78
 *   5. PEOPLE ARRIVAL  people track mid-travel
 * Plus a scroll GIF (HERO REST → PEOPLE ARRIVAL) at a smaller viewport.
 *
 * Capture method: plain viewport screenshot + double-rAF flush per frame
 * (v2-proven fresh frames — verified distinct per state; clip capture was
 * empirically caching one stale frame at desktop size).
 *
 * No full-page screenshots. No source modification.
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/_evi/frag-v3-review";
mkdirSync(OUT, { recursive: true });

const settle = (ms = 400) => new Promise((r) => setTimeout(r, ms));

async function flushFrames(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))),
      ),
  );
}

async function shotPlain(page, path) {
  // settle ≥800ms + flushFrames before every shot (fresh compositor frame).
  await settle(800);
  await flushFrames(page);
  await page.screenshot({ path });
}

async function expandFragments(page) {
  const row = await page.evaluateHandle(() =>
    [...document.querySelectorAll("#what-i-do li button")].find((b) =>
      b.textContent.trimStart().startsWith("Fragments"),
    ),
  );
  if (!row.asElement()) throw new Error("Fragments row not found");
  await row.asElement().click();
  await settle(1500);
}

async function measureAnchors(page) {
  return page.evaluate(() => {
    const hero = document.querySelector('[data-qa="hero-scene"]');
    const people = document.querySelector('[data-qa="people-wrap"]');
    const hr = hero.getBoundingClientRect();
    const pr = people.getBoundingClientRect();
    const heroTravel = hr.height - window.innerHeight;
    const peopleTravel = Math.max(0, pr.height - window.innerHeight);
    return {
      heroY: window.scrollY + hr.top,
      heroTravel,
      peopleY: window.scrollY + pr.top,
      peopleMid: window.scrollY + pr.top + peopleTravel / 2,
    };
  });
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

// ── PASS 1 · the five review states (1440×900) ─────────────────────────
const page = await browser.newPage();
const W = 1440, H = 900;
await page.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "no-preference" },
]);
await page.setViewport({ width: W, height: H });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 60000 });
await expandFragments(page);

const anchors = await measureAnchors(page);
console.log("anchors", JSON.stringify(anchors));

// Lazy-load pass so every fragment image is rasterized before capture.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 600));
});

const states = [
  ["1-hero-rest", 0],
  ["2-hero-early", 0.15],
  ["3-hero-mid", 0.5],
  ["4-hero-transition", 0.78],
];
for (const [name, progress] of states) {
  await page.evaluate(
    ({ y, travel, progress }) => window.scrollTo(0, y + travel * progress),
    { y: anchors.heroY, travel: anchors.heroTravel, progress },
  );
  await shotPlain(page, `${OUT}/${name}.png`);
}
await page.evaluate((y) => window.scrollTo(0, y), anchors.peopleMid);
await shotPlain(page, `${OUT}/5-people-arrival.png`);

await page.close();

// ── PASS 2 · the scroll GIF (960×600, HERO REST → PEOPLE ARRIVAL) ───────
const gp = await browser.newPage();
const GW = 960, GH = 600;
await gp.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "no-preference" },
]);
await gp.setViewport({ width: GW, height: GH });
await gp.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 60000 });
await expandFragments(gp);

const gAnchors = await measureAnchors(gp);
await gp.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 600));
});

const FRAMES = 64;
mkdirSync(`${OUT}/frames`, { recursive: true });
for (let i = 0; i < FRAMES; i++) {
  const t = i / (FRAMES - 1);
  // First 85% of the timeline travels the hero scene; the last 15% crosses
  // the people arrival (track moving).
  const target =
    t < 0.85
      ? gAnchors.heroY + gAnchors.heroTravel * (t / 0.85)
      : gAnchors.heroY +
        gAnchors.heroTravel +
        ((t - 0.85) / 0.15) *
          (gAnchors.peopleMid - gAnchors.heroY - gAnchors.heroTravel);
  await gp.evaluate((y) => window.scrollTo(0, y), target);
  await settle(80);
  await flushFrames(gp);
  await gp.screenshot({ path: `${OUT}/frames/f${String(i).padStart(3, "0")}.png` });
}
await gp.close();
await browser.close();
console.log("done", FRAMES, "frames");
