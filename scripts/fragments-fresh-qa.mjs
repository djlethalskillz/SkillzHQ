/**
 * FRAGMENTS MOTION QA — waypoint-engine evidence set. QA artifact only.
 *
 * The engine is now stochastic waypoint travel (no __FRAG_TIME__ override):
 * stills are captured at REAL elapsed scene-time — REST (just settled),
 * EARLY (+3s), ACTIVE (+12s), REORGANIZED (+30s) — page stationary, no
 * scrolling between frames. The GIF records 15s of real continuous motion.
 *
 * Captures the ACTUAL Fragments scene. Puppeteer screenshot clip is
 * PAGE-relative, so every shot is offset by live scrollY — without this the
 * "scene" images silently contain the landing page (previous session's bug).
 *
 * Set: DESKTOP 1440x900 (scene + GIF), TABLET 1024x768, MOBILE 390x844,
 * REDUCED-MOTION 1440x900 static composition.
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { spawnSync as spawn } from "node:child_process";

const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = "scripts/_evi";
const FRAMES_DIR = `${OUT}/frag-fresh-frames`;
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES_DIR, { recursive: true });

const settle = (ms = 400) => new Promise((r) => setTimeout(r, ms));

async function flushFrames(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))),
      ),
  );
}

async function shot(page, path) {
  const sy = await page.evaluate(() => document.documentElement.scrollTop);
  await page.screenshot({
    path,
    clip: { x: 0, y: sy, width: page.viewport().width, height: page.viewport().height },
  });
}

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
  await settle(1600); // entrance settle well past
  await flushFrames(page);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});

// ── DESKTOP 1440x900 — scene stills + motion GIF ─────────────────────────
{
  const page = await browser.newPage();
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);
  await page.setViewport({ width: 1440, height: 900 });
  await openScene(page);

  await shot(page, `${OUT}/FRAGMENTS_REST.png`);
  console.log("FRAGMENTS_REST.png t≈0s");

  await settle(3000);
  await flushFrames(page);
  await shot(page, `${OUT}/FRAGMENTS_EARLY.png`);
  console.log("FRAGMENTS_EARLY.png t≈3s");

  await settle(9000);
  await flushFrames(page);
  await shot(page, `${OUT}/FRAGMENTS_ACTIVE.png`);
  console.log("FRAGMENTS_ACTIVE.png t≈12s");

  await settle(18000);
  await flushFrames(page);
  await shot(page, `${OUT}/FRAGMENTS_REORGANIZED.png`);
  console.log("FRAGMENTS_REORGANIZED.png t≈30s");

  // Motion GIF — 15s real continuous motion, no scrolling. Every 3rd frame
  // also records the z-20 face-overlap census (syncs with the pixel check).
  const FPS = 8;
  const N = FPS * 15;
  const censusLog = [];
  for (let i = 0; i <= N; i++) {
    await flushFrames(page);
    await shot(page, `${FRAMES_DIR}/f${String(i).padStart(3, "0")}.png`);
    if (i % 3 === 0) {
      censusLog.push(await page.evaluate(() => {
        // Spindle protection (vinyl-orbit engine): NO fragment box may
        // intersect the hero MOUNT (photo + paper + caption) at any frame.
        const hero = document.querySelector('[data-qa="fragments-hero-photo"]');
        const scene = document.querySelector('[data-qa="fragments-scene"]');
        const mr = hero.parentElement.getBoundingClientRect();
        const sr = scene.getBoundingClientRect();
        const mx0 = mr.left - sr.left;
        const mx1 = mr.left - sr.left + mr.width;
        const my0 = mr.top - sr.top;
        const my1 = mr.top - sr.top + mr.height;
        const res = [];
        for (const el of document.querySelectorAll('[data-qa="fragments-field"] figure')) {
          const r = el.getBoundingClientRect();
          const ox = Math.max(0, Math.min(mx1, r.right - sr.left) - Math.max(mx0, r.left - sr.left));
          const oy = Math.max(0, Math.min(my1, r.bottom - sr.top) - Math.max(my0, r.top - sr.top));
          if (ox > 0 && oy > 0) {
            const area = ox * oy;
            const farea = (r.right - r.left) * (r.bottom - r.top);
            res.push({
              id: el.dataset.qa,
              pct: Math.round((area / farea) * 100),
              img: el.querySelector("img, canvas")?.src?.split("/").pop(),
            });
          }
        }
        return res;
      }));
    }
  }
  const { writeFileSync } = await import("node:fs");
  writeFileSync(`${OUT}/qa-census.json`, JSON.stringify(censusLog));
  console.log(`gif frames: ${N + 1}`);
  await page.close();

  const palette = `${OUT}/frag-fresh-palette.png`;
  spawn("ffmpeg", [
    "-y", "-framerate", `${FPS}`, "-i", `${FRAMES_DIR}/f%03d.png`,
    "-vf", `scale=720:-1:flags=lanczos,palettegen=max_colors=256`,
    "-frames:v", "1", "-update", "1",
    palette,
  ], { stdio: "inherit" });
  spawn("ffmpeg", [
    "-y", "-framerate", `${FPS}`, "-i", `${FRAMES_DIR}/f%03d.png`,
    "-i", palette,
    "-lavfi", `scale=720:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5`,
    `${OUT}/FRAGMENTS_MOTION_REVIEW.gif`,
  ], { stdio: "inherit" });
}

// ── TABLET 1024x768 ───────────────────────────────────────────────────────
{
  const page = await browser.newPage();
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);
  await page.setViewport({ width: 1024, height: 768 });
  await openScene(page);
  await shot(page, `${OUT}/FRAGMENTS_TABLET_ACTIVE.png`);
  await page.close();
  console.log("FRAGMENTS_TABLET_ACTIVE.png");
}

// ── MOBILE 390x844 ────────────────────────────────────────────────────────
{
  const page = await browser.newPage();
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);
  await page.setViewport({ width: 390, height: 844 });
  await openScene(page);
  await shot(page, `${OUT}/FRAGMENTS_MOBILE_ACTIVE.png`);
  await page.close();
  console.log("FRAGMENTS_MOBILE_ACTIVE.png");
}

// ── REDUCED MOTION 1440x900 — static composition ─────────────────────────
{
  const page = await browser.newPage();
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.setViewport({ width: 1440, height: 900 });
  await openScene(page);
  await shot(page, `${OUT}/FRAGMENTS_REDUCED_STATIC.png`);
  const moving = await page.evaluate(() =>
    [...document.querySelectorAll('[data-qa="fragments-field"] figure')].filter(
      (el) => el.style.transform,
    ).length,
  );
  console.log("FRAGMENTS_REDUCED_STATIC.png (transformed figures:", moving, ")");
  await page.close();
}

await browser.close();
console.log("DONE");
