// Hero 2 debug: console errors, failed requests, layer visibility.
import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-first-run", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const consoleMsgs = [];
page.on("console", (m) => consoleMsgs.push(`[${m.type()}] ${m.text()}`));
page.on("requestfailed", (r) => consoleMsgs.push(`[FAIL] ${r.url()} ${r.failure()?.errorText}`));
page.on("response", (r) => {
  if (r.status() >= 400) consoleMsgs.push(`[HTTP ${r.status()}] ${r.url()}`);
});

await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2000));

const info = await page.evaluate(() => {
  const section = document.querySelector("#landing");
  const secRect = section?.getBoundingClientRect();
  const imgs = [...document.querySelectorAll("#landing img")].map((im) => {
    const r = im.getBoundingClientRect();
    return {
      src: im.getAttribute("src"),
      w: Math.round(r.width), h: Math.round(r.height),
      visible: im.complete && im.naturalWidth > 0,
      nat: im.naturalWidth ? `${im.naturalWidth}x${im.naturalHeight}` : "0x0",
      z: getComputedStyle(im).zIndex,
    };
  });
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const secBg = section ? getComputedStyle(section).backgroundColor : "none";
  return { secRect: secRect ? { w: Math.round(secRect.width), h: Math.round(secRect.height) } : null, bodyBg, secBg, imgs, docBg: getComputedStyle(document.documentElement).backgroundColor };
});
console.log(JSON.stringify(info, null, 1));
console.log("--- console ---");
console.log(consoleMsgs.join("\n"));
await page.screenshot({ path: "C:/Users/djlet/AppData/Local/Temp/hero2-debug.png" });
await browser.close();
