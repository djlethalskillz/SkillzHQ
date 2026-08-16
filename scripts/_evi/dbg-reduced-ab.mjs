/**
 * FORENSIC A/B — reduced-motion replication probe.
 * Mode A: headless default (no-preference) — engine live?
 * Mode B: emulate prefers-reduced-motion: reduce — reproduces user symptom?
 * Mode C: mode A + 35s dwell, samples at t5/t35 (user's exact watch pattern).
 * No source changes. QA artifact only.
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
  await settle(1500);
  for (let i = 0; i < 6; i++) {
    const t = await page.evaluate(() => {
      const s = document.querySelector('[data-qa="fragments-scene"]');
      const t = s.getBoundingClientRect().top;
      if (Math.abs(t) > 0.5) document.documentElement.scrollTop += t;
      return t;
    });
    await settle(120);
    if (Math.abs(t) <= 0.5) break;
  }
  await settle(400);
}

const sample = () =>
  page.evaluate(() => {
    const figs = [...document.querySelectorAll('[data-qa="fragments-field"] figure')];
    const five = figs.slice(0, 5).map((f) => ({
      id: f.dataset.qa,
      t: f.style.transform,
      z: getComputedStyle(f).zIndex,
      op: f.style.opacity,
    }));
    return {
      matchMediaReduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      hidden: document.hidden,
      figCount: figs.length,
      withTransform: figs.filter((f) => f.style.transform).length,
      five,
    };
  });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});

let page;

// ── MODE A — default (headless = no-preference) ──────────────────────────
{
  page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await openScene(page);
  const a0 = await sample();
  await settle(2000);
  const a1 = await sample();
  // rAF heartbeat
  const hb = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let n = 0;
        const t0 = performance.now();
        const loop = () => {
          n++;
          if (performance.now() - t0 < 2000) requestAnimationFrame(loop);
          else resolve(n);
        };
        requestAnimationFrame(loop);
      }),
  );
  console.log("A(no-preference) rAF callbacks/2s:", hb, "| reduce:", a0.matchMediaReduce, "| figs:", a0.figCount, "| transformed:", a0.withTransform);
  console.log("A t0:", JSON.stringify(a0.five));
  console.log("A t+2s:", JSON.stringify(a1.five));
  console.log("A transforms changed:", a0.five.some((f, i) => f.t !== a1.five[i].t));
  await page.close();
}

// ── MODE B — emulate reduce ───────────────────────────────────────────────
{
  page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.setViewport({ width: 1440, height: 900 });
  await openScene(page);
  const b0 = await sample();
  await settle(5000);
  const b1 = await sample();
  await settle(25000);
  const b2 = await sample();
  const hb = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let n = 0;
        const t0 = performance.now();
        const loop = () => {
          n++;
          if (performance.now() - t0 < 2000) requestAnimationFrame(loop);
          else resolve(n);
        };
        requestAnimationFrame(loop);
      }),
  );
  console.log("\nB(reduce) rAF callbacks/2s:", hb, "| reduce:", b0.matchMediaReduce, "| hidden:", b0.hidden, "| figs:", b0.figCount, "| transformed:", b0.withTransform);
  console.log("B t0:  ", JSON.stringify(b0.five));
  console.log("B t+5s:", JSON.stringify(b1.five));
  console.log("B t+30s:", JSON.stringify(b2.five));
  console.log("B transforms changed over 30s:", b0.five.some((f, i) => f.t !== b2.five[i].t));
  await page.close();
}

// ── MODE C — no-preference, 35s dwell, t5/t35 samples (user's watch) ─────
{
  page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await openScene(page);
  await settle(5000);
  const c5 = await sample();
  await settle(30000);
  const c35 = await sample();
  console.log("\nC(no-pref) t+5s:", JSON.stringify(c5.five));
  console.log("C t+35s:", JSON.stringify(c35.five));
  console.log("C transforms changed over 30s:", c5.five.some((f, i) => f.t !== c35.five[i].t));
  await page.close();
}

await browser.close();
console.log("\nAB DONE");
