/**
 * FRAGMENTS DNA PROBE — verify the transplanted Living Archive visual
 * vocabulary actually renders in the DOM (mounts, tape, arch words,
 * captions printed on mounts, grain, vignette). No vision required:
 * computed styles and DOM structure are the evidence.
 */
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});

const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("#what-i-do li button")].find((b) =>
    b.textContent.includes("Fragments"),
  );
  btn.click();
});
await new Promise((r) => setTimeout(r, 1800));
await page.evaluate(() => {
  document.querySelector('[data-qa="fragments-scene"]').scrollIntoView({ block: "start" });
});
await new Promise((r) => setTimeout(r, 500));

const out = await page.evaluate(() => {
  const cs = (el, prop) => getComputedStyle(el)[prop];
  const scene = document.querySelector('[data-qa="fragments-scene"]');
  const figs = [...scene.querySelectorAll("figure[data-qa]")];
  const find = (id) => figs.find((f) => f.dataset.qa === id);

  const mountInfo = (frag) => {
    const mount = frag.querySelector("div:not([class*=absolute])") || frag.querySelector("div");
    return mount ? { cls: mount.className.slice(0, 120), bg: cs(mount, "backgroundColor"), shadow: cs(mount, "boxShadow").slice(0, 40) } : null;
  };

  const capOf = (frag) => {
    const cap = frag.querySelector("figcaption");
    if (!cap) return null;
    return {
      family: cs(cap, "fontFamily").split(",")[0],
      size: cs(cap, "fontSize"),
      color: cs(cap, "color"),
      text: cap.textContent.trim().slice(0, 60),
    };
  };

  const flyerClip = (frag) => cs(frag.querySelector("img").closest("div"), "clipPath").slice(0, 80);
  const tape = (frag) => {
    const t = frag.querySelector("span[class*='-top-[10px]']");
    return t ? { w: cs(t, "width"), h: cs(t, "height"), bg: cs(t, "backgroundColor"), rot: cs(t, "transform").slice(0, 30) } : null;
  };

  const archWords = [...scene.querySelectorAll(".font-arch")]
    .filter((s) => cs(s, "fontFamily").includes("Big Shoulders"))
    .map((s) => ({ text: s.textContent.trim(), size: cs(s, "fontSize"), color: cs(s, "color"), opacity: cs(s, "opacity") }));

  const overlays = [...scene.children]
    .filter((d) => cs(d, "position") === "absolute" && d !== scene.firstElementChild)
    .map((d) => ({ bg: cs(d, "backgroundImage").slice(0, 60) || cs(d, "background").slice(0, 80) }));

  return {
    sceneFound: !!scene,
    fragmentCount: figs.length,
    instant: mountInfo(find("frag-qbert")),
    instantCap: capOf(find("frag-qbert")),
    flyer: mountInfo(find("frag-one-nation")),
    flyerClip: flyerClip(find("frag-one-nation")),
    flyerCap: capOf(find("frag-one-nation")),
    pass: mountInfo(find("frag-ufo-badge")),
    passCap: capOf(find("frag-ufo-badge")),
    jcard: mountInfo(find("frag-studio-2012")),
    jcardCap: capOf(find("frag-studio-2012")),
    tapeTrio: [find("frag-qbert"), find("frag-one-nation"), find("frag-ufo-badge")].map((f) => tape(f)),
    archWords,
    heroMount: mountInfo(document.querySelector('[data-qa="fragments-hero"] > div')),
    heroCap: capOf(document.querySelector('[data-qa="fragments-hero"]')),
    hasGrain: !!scene.querySelector(".grain"),
    hasVignette: overlays.some((o) => o.bg.includes("radial")),
    metaLine: [...scene.querySelectorAll(".font-arch-mono")].map((s) => s.textContent.trim()),
  };
});

console.log(JSON.stringify(out, null, 1));
await browser.close();
