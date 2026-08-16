/**
 * GUARD PROBE — census + engine state + boxes in ONE sample, 10x over 5s.
 * If census shows an overlap, the tick values tell us whether the bow fired.
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
  await settle(1600);
}

const sample = () =>
  page.evaluate(() => {
    const hero = document.querySelector('[data-qa="fragments-hero-photo"]');
    const scene = document.querySelector('[data-qa="fragments-scene"]');
    const mr = hero.parentElement.getBoundingClientRect();
    const sr = scene.getBoundingClientRect();
    const mx0 = mr.left - sr.left, mx1 = mx0 + mr.width;
    const my0 = mr.top - sr.top, my1 = my0 + mr.height;
    const overlaps = [];
    const boxById = {};
    for (const el of document.querySelectorAll('[data-qa="fragments-field"] figure')) {
      const r = el.getBoundingClientRect();
      const x0 = r.left - sr.left, x1 = r.right - sr.left;
      const y0 = r.top - sr.top, y1 = r.bottom - sr.top;
      const ox = Math.max(0, Math.min(mx1, x1) - Math.max(mx0, x0));
      const oy = Math.max(0, Math.min(my1, y1) - Math.max(my0, y0));
      if (ox > 0 && oy > 0) {
        overlaps.push(el.dataset.qa);
        boxById[el.dataset.qa] = [Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1)];
      }
    }
    const dbg = window.__FRAG_DEBUG__ ?? {};
    const ticks = {};
    for (const [k, v] of Object.entries(dbg)) {
      if (k.startsWith("tick:")) {
        const id = k.slice(5);
        if (overlaps.includes("frag-" + id)) ticks[id] = v;
      }
    }
    return { overlaps: overlaps.join(" "), ticks, boxById };
  });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
await page.setViewport({ width: 1440, height: 900 });
await openScene(page);
await settle(30000);
for (let i = 0; i < 10; i++) {
  const s = await sample();
  const t = Object.values(s.ticks)[0];
  console.log(`t+${i * 0.5}s overlaps=[${s.overlaps}]`);
  for (const [id, tk] of Object.entries(s.ticks)) {
    const b = s.boxById["frag-" + id];
    console.log(`  ${id} tick=${JSON.stringify(tk)} box=${b ? b.join(",") : "CLEAR-NOW"}`);
  }
  await settle(500);
}
await page.close();
await browser.close();
console.log("PROBE DONE");
