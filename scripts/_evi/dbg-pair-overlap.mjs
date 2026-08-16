/**
 * PAIR-OVERLAP PROBE — are fragments individually readable?
 * Counts pairwise box overlaps at a live sample and how deep they are.
 * Light/incidental = OK (a few %, no >60% of a box buried).
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

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
await page.setViewport({ width: 1440, height: 900 });
await openScene(page);
await settle(12000); // platter awake, settled

const samples = [];
for (let s = 0; s < 5; s++) {
  const data = await page.evaluate(() => {
    const scene = document.querySelector('[data-qa="fragments-scene"]');
    const sr = scene.getBoundingClientRect();
    const boxes = [...document.querySelectorAll('[data-qa="fragments-field"] figure')].map((el) => {
      const r = el.getBoundingClientRect();
      return { id: el.dataset.qa, z: Number(getComputedStyle(el).zIndex), x0: r.left - sr.left, y0: r.top - sr.top, x1: r.left - sr.left + r.width, y1: r.top - sr.top + r.height };
    });
    // same-layer pairs = real stacking (both at same z); cross-layer overlap
    // is the intended depth system (deep behind primary).
    const pairs = [];
    const sameLayer = [];
    let buried = 0;
    let buriedSame = 0;
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
        const oy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
        if (ox <= 0 || oy <= 0) continue;
        const inter = ox * oy;
        const areaA = (a.x1 - a.x0) * (a.y1 - a.y0);
        const areaB = (b.x1 - b.x0) * (b.y1 - b.y0);
        const deep = Math.max(inter / areaA, inter / areaB);
        if (deep > 0.6) {
          buried++;
          if (a.z === b.z) buriedSame++;
        }
        pairs.push(deep);
        if (a.z === b.z) sameLayer.push(deep);
      }
    }
    const avg = (arr) => (arr.length ? arr.reduce((x, y) => x + y, 0) / arr.length : 0);
    return { n: boxes.length, pairCount: pairs.length, buried, buriedSame, sameLayerCount: sameLayer.length, maxDeep: pairs.length ? Math.max(...pairs) : 0, meanDeep: avg(pairs), sameMean: avg(sameLayer) };
  });
  samples.push(data);
  await settle(2000);
}
for (const [i, d] of samples.entries()) {
  console.log(`t+${i * 2}s figs=${d.n} pairs=${d.pairCount} sameLayer=${d.sameLayerCount} buried(>60%)=${d.buried} buriedSameLayer=${d.buriedSame} sameMean=${(d.sameMean * 100).toFixed(1)}%`);
}
await page.close();
await browser.close();
console.log("PROBE DONE");
