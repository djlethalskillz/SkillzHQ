/**
 * HERO MOUNT PROBE — decisive: sample figure boxes vs hero mount 12x over 6s.
 * Any intersection = fragment parked on the mount = real protection bug.
 * Also dumps per-figure offset (box center minus mount center) for flagged ids.
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

const census = () =>
  page.evaluate(() => {
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
      const x0 = r.left - sr.left, x1 = r.right - sr.left;
      const y0 = r.top - sr.top, y1 = r.bottom - sr.top;
      const ox = Math.max(0, Math.min(mx1, x1) - Math.max(mx0, x0));
      const oy = Math.max(0, Math.min(my1, y1) - Math.max(my0, y0));
      if (ox > 0 && oy > 0) {
        res.push({
          id: el.dataset.qa,
          pct: Math.round((ox * oy) / ((x1 - x0) * (y1 - y0)) * 100),
          box: [Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1)],
          off: [Math.round((x0 + x1) / 2 - mr.left + sr.left - mr.width / 2), Math.round((y0 + y1) / 2 - mr.top + sr.top - mr.height / 2)],
          t: el.style.transform.slice(0, 60),
        });
      }
    }
    const watch = ["frag-d-cambodia", "frag-d-3style", "frag-d-nu-mark", "frag-d-ufo", "frag-keith-shocklee", "frag-d-beirut", "frag-d-archive-zion", "frag-cur-961"];
    const tracked = [];
    for (const el of document.querySelectorAll('[data-qa="fragments-field"] figure')) {
      if (!watch.includes(el.dataset.qa)) continue;
      const r = el.getBoundingClientRect();
      const x0 = r.left - sr.left, x1 = r.right - sr.left;
      const y0 = r.top - sr.top, y1 = r.bottom - sr.top;
      tracked.push({
        id: el.dataset.qa,
        box: [Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1)],
        off: [Math.round((x0 + x1) / 2 - mx0 - mr.width / 2), Math.round((y0 + y1) / 2 - my0 - mr.height / 2)],
      });
    }
    return {
      mount: [Math.round(mx0), Math.round(my0), Math.round(mx1), Math.round(my1)],
      overlaps: res,
      tracked,
    };
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
await settle(30000); // match census timing: t≈32s, poses long settled
for (let i = 0; i < 12; i++) {
  const c = await census();
  const ids = c.overlaps.map((o) => `${o.id}:${o.pct}%`);
  console.log(`t+${i * 0.5}s mount=${c.mount.join(",")} overlaps=[${ids.join(" ")}]`);
  if (i === 0) {
    for (const t of c.tracked) console.log(`  ${t.id} box=${t.box.join(",")} offFromMountCenter=${t.off.join(",")}`);
  }
  await settle(500);
}
if (await page.evaluate(() => false)) {}
await page.close();
await browser.close();
console.log("PROBE DONE");
