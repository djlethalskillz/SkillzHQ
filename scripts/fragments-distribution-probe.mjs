/**
 * FRAGMENTS DISTRIBUTION PROBE — verifies the exploded-field correction:
 * quadrant coverage, hero face clearance at rest, live reach over time.
 * QA artifact only. No source changes.
 */
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const settle = (ms = 400) => new Promise((r) => setTimeout(r, ms));

async function openScene(page) {
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#what-i-do li button")].find((b) =>
      b.textContent.includes("Fragments"),
    );
    btn.click();
  });
  await settle(1200);
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
  await settle(400);
}

const rects = () =>
  page.evaluate(() => {
    const scene = document.querySelector('[data-qa="fragments-scene"]');
    const sr = scene.getBoundingClientRect();
    const hero = document.querySelector('[data-qa="fragments-hero-photo"]');
    const mr = hero.parentElement.getBoundingClientRect();
    return {
      sw: sr.width,
      sh: sr.height,
      // spindle zone = the hero MOUNT (photo + paper + caption strip)
      mount: {
        x0: mr.left - sr.left,
        x1: mr.left - sr.left + mr.width,
        y0: mr.top - sr.top,
        y1: mr.top - sr.top + mr.height,
      },
      figs: [...document.querySelectorAll('[data-qa="fragments-field"] figure')].map((f) => {
        const r = f.getBoundingClientRect();
        return {
          id: f.dataset.qa,
          z: Number(getComputedStyle(f).zIndex),
          x: r.left - sr.left,
          y: r.top - sr.top,
          w: r.width,
          h: r.height,
        };
      }),
    };
  });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});
let page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);

// ── DESKTOP 1440×900 ────────────────────────────────────────────────────
await page.setViewport({ width: 1440, height: 900 });
await openScene(page);
let r = await rects();
const rest = r;
const q = (x0, x1, y0, y1) =>
  rest.figs.filter((f) => f.x + f.w / 2 > (x0 / 100) * rest.sw && f.x + f.w / 2 < (x1 / 100) * rest.sw && f.y + f.h / 2 > (y0 / 100) * rest.sh && f.y + f.h / 2 < (y1 / 100) * rest.sh).length;
const overlapFace = rest.figs.filter(
  (f) => f.x < rest.mount.x1 && f.x + f.w > rest.mount.x0 && f.y < rest.mount.y1 && f.y + f.h > rest.mount.y0,
);
const nearHero = rest.figs.filter((f) => {
  const cx = f.x + f.w / 2 - rest.sw / 2;
  const cy = f.y + f.h / 2 - rest.sh / 2;
  return Math.hypot(cx, cy) < rest.sw * 0.2;
}).length;
const sizes = rest.figs.map((f) => f.w);
console.log("REST 1440x900 — figs:", rest.figs.length);
console.log("  quadrants (TL TR BL BR):", q(0, 50, 0, 50), q(50, 100, 0, 50), q(0, 50, 50, 100), q(50, 100, 50, 100));
console.log("  mount overlaps (ANY fragment vs hero mount):", overlapFace.map((f) => f.id));
console.log("  figs with center <20% of width from centre:", nearHero.length);
console.log("  width range:", Math.round(Math.min(...sizes)), "-", Math.round(Math.max(...sizes)), "px; hero:", rest.figs.length ? "" : "");

// live reach: track max distance from centre over 30s
await settle(30000);
r = await rects();
const reach = r.figs.map((f) => {
  const cx = f.x + f.w / 2 - r.sw / 2;
  const cy = f.y + f.h / 2 - r.sh / 2;
  return Math.hypot(cx, cy);
});
// RING ANALYSIS — even-ladder radii (unique per fragment) vs shared-ring
// clusters. Histogram of observed radii in 5% scene-width bins: an even
// stride reads as a smooth ladder (no spikes); clusters read as a spike.
const radii = reach.map((d) => d / r.sw);
const sorted = [...radii].sort((a, b) => a - b);
const bins = {};
for (const rd of radii) {
  const b = Math.floor(rd / 0.05) * 5;
  bins[`${b}-${b + 5}%`] = (bins[`${b}-${b + 5}%`] ?? 0) + 1;
}
// ANGULAR ANALYSIS — are the fragments around the centre a spread field or
// a few piles? 45° histogram of positions around the spindle.
const angBins = Array(8).fill(0);
for (const f of r.figs) {
  const a = Math.atan2(f.y + f.h / 2 - r.sh / 2, f.x + f.w / 2 - r.sw / 2);
  const b = Math.floor(((a + Math.PI) / (2 * Math.PI)) * 8) % 8;
  angBins[b]++;
}
const maxD = Math.max(...reach);
const edge = r.figs.filter((f) => {
  const cx = f.x + f.w / 2;
  const cy = f.y + f.h / 2;
  return cx < r.sw * 0.08 || cx > r.sw * 0.92 || cy < r.sh * 0.08 || cy > r.sh * 0.92;
}).length;
console.log("LIVE 30s — max center distance from centre:", Math.round(maxD), "px (corner distance:", Math.round(Math.hypot(r.sw, r.sh) / 2), ")");
console.log("  figs in outer 8% band:", edge, "of", r.figs.length);
console.log("  radius histogram (5% scene-width bins):", JSON.stringify(bins));
console.log("  radius spread: min", (Math.min(...sorted) * 100).toFixed(1), "% max", (Math.max(...sorted) * 100).toFixed(1), "% of scene width");
console.log("  angular histogram (45° bins around spindle):", angBins.join(" "));
console.log("  mount overlaps (ANY fragment vs hero mount):", r.figs.filter((f) => f.x < r.mount.x1 && f.x + f.w > r.mount.x0 && f.y < r.mount.y1 && f.y + f.h > r.mount.y0).map((f) => f.id));
await page.close();

// ── MOBILE 390×844 ──────────────────────────────────────────────────────
page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
await page.setViewport({ width: 390, height: 844 });
await openScene(page);
r = await rects();
const mq = (x0, x1, y0, y1) =>
  r.figs.filter((f) => f.x + f.w / 2 > (x0 / 100) * r.sw && f.x + f.w / 2 < (x1 / 100) * r.sw && f.y + f.h / 2 > (y0 / 100) * r.sh && f.y + f.h / 2 < (y1 / 100) * r.sh).length;
const mOverlap = r.figs.filter(
  (f) => f.x < r.mount.x1 && f.x + f.w > r.mount.x0 && f.y < r.mount.y1 && f.y + f.h > r.mount.y0,
);
console.log("\nREST 390x844 — figs:", r.figs.length);
console.log("  quadrants (TL TR BL BR):", mq(0, 50, 0, 50), mq(50, 100, 0, 50), mq(0, 50, 50, 100), mq(50, 100, 50, 100));
console.log("  face overlaps z>=20:", mOverlap.map((f) => f.id));
console.log("  mount:", Math.round(r.mount.x1 - r.mount.x0), "px wide vs scene", Math.round(r.sw));
await page.close();

await browser.close();
console.log("PROBE DONE");
