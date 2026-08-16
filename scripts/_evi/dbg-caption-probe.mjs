/**
 * CAPTION PROBE — computed typography + wrap + clip check for fragment captions.
 * Verifies size/weight/tracking/color landed, no caption overflows its mount,
 * no dates in visible caption text, across desktop/tablet/mobile.
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
  await settle(2600); // entrance settle
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);

for (const [label, w, h] of [
  ["DESKTOP", 1440, 900],
  ["TABLET", 1024, 768],
  ["MOBILE", 390, 844],
]) {
  await page.setViewport({ width: w, height: h });
  await openScene(page);
  const out = await page.evaluate(() => {
    const scene = document.querySelector('[data-qa="fragments-scene"]');
    const caps = [...scene.querySelectorAll("figcaption")].map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const mount = el.parentElement.getBoundingClientRect();
      const text = el.textContent.trim();
      const overflowY = r.top < mount.top + 2 || r.bottom > mount.bottom + 2;
      const overflowX = r.left < mount.left - 2 || r.right > mount.right + 2;
      return {
        text,
        fs: cs.fontSize,
        fw: cs.fontWeight,
        ls: cs.letterSpacing,
        color: cs.color,
        lines: Math.round(r.height / parseFloat(cs.lineHeight)),
        overflowY,
        overflowX,
      };
    });
    return {
      n: caps.length,
      samples: caps.filter((c) => c.text.includes("JEFF") || c.text.includes("NU-MARK") || c.text.includes("SUESIDE") || c.text.includes("BEIRUT")),
      clipped: caps.filter((c) => c.overflowX || c.overflowY).map((c) => c.text),
      dated: caps.filter((c) => /\b(19|20)\d{2}\b/.test(c.text)).map((c) => c.text),
      wrap3: caps.filter((c) => c.lines >= 3).map((c) => `${c.lines}L:${c.text}`),
    };
  });
  console.log(`=== ${label} ===`);
  console.log("captions:", out.n, "| samples:", JSON.stringify(out.samples.map((s) => ({ t: s.text.slice(0, 28), fs: s.fs, fw: s.fw, ls: s.ls, color: s.color, lines: s.lines })), null, 0));
  console.log("clipped:", out.clipped, "| dated:", out.dated, "| 3+line:", out.wrap3.slice(0, 8));
}

// reduced motion check
await page.setViewport({ width: 1440, height: 900 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await openScene(page);
const reduced = await page.evaluate(() => {
  const scene = document.querySelector('[data-qa="fragments-scene"]');
  return [...scene.querySelectorAll('[data-qa="fragments-field"] figure')].filter(
    (el) => getComputedStyle(el).transform !== "none",
  ).length;
});
console.log("REDUCED transformed figures:", reduced);
await browser.close();
console.log("PROBE DONE");
