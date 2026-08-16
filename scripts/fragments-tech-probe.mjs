/**
 * FRAGMENTS TECH PROBE — console errors, failed requests, horizontal
 * overflow, hydration errors, runtime errors at 3 viewports. QA artifact only.
 */
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const settle = (ms = 400) => new Promise((r) => setTimeout(r, ms));

async function openScene(page) {
  const logs = { console: [], failed: [], pageErrors: [] };
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") logs.console.push(m.text());
  });
  page.on("requestfailed", (r) =>
    logs.failed.push(`${r.failure()?.errorText} ${r.url()}`),
  );
  page.on("pageerror", (e) => logs.pageErrors.push(String(e)));

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
  await settle(2500);

  const metrics = await page.evaluate(() => {
    const scene = document.querySelector('[data-qa="fragments-scene"]');
    const doc = document.documentElement;
    const hero = document.querySelector('[data-qa="fragments-hero-photo"]');
    const figures = [...document.querySelectorAll('[data-qa="fragments-field"] figure')];
    return {
      docScrollW: doc.scrollWidth,
      docClientW: doc.clientWidth,
      hOverflow: doc.scrollWidth > doc.clientWidth,
      sceneTop: Math.round(scene.getBoundingClientRect().top),
      sceneH: Math.round(scene.getBoundingClientRect().height),
      sceneW: Math.round(scene.getBoundingClientRect().width),
      heroLoaded: hero.complete && hero.naturalWidth > 0,
      heroBox: Math.round(hero.getBoundingClientRect().width),
      figCount: figures.length,
      figsOutside: figures.filter((f) => {
        const r = f.getBoundingClientRect();
        return r.right < -50 || r.left > scene.getBoundingClientRect().width + 50;
      }).length,
      transformed: figures.filter((f) => f.style.transform).length,
      moved: figures.filter((f) => {
        const t = f.style.transform;
        const m = t && t.match(/translate3d\((-?[\d.]+)px,\s*(-?[\d.]+)px/);
        return m && (Math.abs(+m[1]) > 1 || Math.abs(+m[2]) > 1);
      }).length,
      z20: figures.filter((f) => getComputedStyle(f).zIndex === "20").length,
      hydration: document.querySelectorAll("body > script[data-next-hydration]").length,
      imagesBroken: figures
        .filter((f) => {
          const img = f.querySelector("img");
          return img && (!img.complete || img.naturalWidth === 0);
        })
        .map((f) => f.dataset.qa),
    };
  });
  return { logs, metrics };
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});

for (const [label, w, h] of [["DESKTOP", 1440, 900], ["TABLET", 1024, 768], ["MOBILE", 390, 844]]) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.setViewport({ width: w, height: h });
  const { logs, metrics } = await openScene(page);
  console.log(`\n=== ${label} ${w}x${h} ===`);
  console.log("metrics:", JSON.stringify(metrics));
  console.log("consoleErrors:", JSON.stringify(logs.console.slice(0, 8)));
  console.log("failedRequests:", JSON.stringify(logs.failed.slice(0, 8)));
  console.log("pageErrors:", JSON.stringify(logs.pageErrors.slice(0, 8)));
  await page.close();
}

await browser.close();
console.log("PROBE DONE");
