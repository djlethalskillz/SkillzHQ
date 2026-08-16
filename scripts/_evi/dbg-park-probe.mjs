/**
 * PARK PROBE — dump parked fragments' base %, transform offsets, box, and
 * inferred orbit center/radius. Pins why guard never engages.
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

const dump = () =>
  page.evaluate(() => {
    const scene = document.querySelector('[data-qa="fragments-scene"]');
    const sr = scene.getBoundingClientRect();
    const hero = document.querySelector('[data-qa="fragments-hero-photo"]');
    const mr = hero.parentElement.getBoundingClientRect();
    const ids = ["frag-d-cambodia", "frag-d-3style", "frag-d-nu-mark", "frag-d-ufo", "frag-d-archive-zion", "frag-cur-961", "frag-keith-shocklee"];
    const figs = {};
    for (const el of document.querySelectorAll('[data-qa="fragments-field"] figure')) {
      if (!ids.includes(el.dataset.qa)) continue;
      const r = el.getBoundingClientRect();
      figs[el.dataset.qa] = {
        basePct: [el.style.left, el.style.top],
        wPct: el.style.width,
        transform: el.style.transform,
        z: el.style.zIndex,
        opacity: el.style.opacity,
        box: [Math.round(r.left - sr.left), Math.round(r.top - sr.top)],
      };
    }
    return {
      scene: [sr.width, sr.height],
      mount: [Math.round(mr.left - sr.left), Math.round(mr.top - sr.top), Math.round(mr.width), Math.round(mr.height)],
      figs,
      debug: window.__FRAG_DEBUG__ ? JSON.stringify(window.__FRAG_DEBUG__).slice(0, 400) : null,
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
await settle(30000);
const d = await dump();
console.log("scene:", d.scene, "mount:", d.mount);
console.log("debug:", d.debug);
for (const [id, f] of Object.entries(d.figs)) {
  const baseX = parseFloat(f.basePct[0]) / 100 * d.scene[0];
  const baseY = parseFloat(f.basePct[1]) / 100 * d.scene[1];
  console.log(`${id} base=${f.basePct.join(",")}% baseScene=(${Math.round(baseX)},${Math.round(baseY)}) box=${f.box.join(",")} z=${f.z} op=${f.opacity}`);
  console.log(`  transform: ${f.transform}`);
}
await page.close();
await browser.close();
console.log("PROBE DONE");
