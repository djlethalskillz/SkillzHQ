/**
 * Speaking loop forensic — fresh browser profile, cache disabled.
 * Proves which bytes the browser actually receives + what the video element renders.
 * Usage: node scripts/speaking-forensic.mjs
 */
import puppeteer from "puppeteer-core";
import { createHash } from "node:crypto";

const URL = "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-extensions"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // network capture: every response for speaking assets
  const net = [];
  page.on("response", async (res) => {
    const u = res.url();
    if (/speaking|video/.test(u)) {
      const body = await res.buffer().catch(() => null);
      net.push({
        url: u,
        status: res.status(),
        type: res.headers()["content-type"] ?? null,
        length: body ? body.length : null,
        hash: body ? createHash("md5").update(body).digest("hex") : null,
      });
    }
  });
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });

  const btn = await page.evaluateHandle(() =>
    [...document.querySelectorAll("#what-i-do li button")].find((b) =>
      b.textContent.includes("Speaking"),
    ),
  );
  await btn.asElement().click();
  await new Promise((r) => setTimeout(r, 3000));

  const state = await page.evaluate(() => {
    const v = document.querySelector("#speaking-archive-panel video");
    if (!v) return { found: false };
    const srcs = [...v.querySelectorAll("source")].map((s) => s.src);
    return {
      found: true,
      srcAttr: v.getAttribute("src"),
      sources: srcs,
      currentSrc: v.currentSrc,
      readyState: v.readyState, // 0-4 (4 = HAVE_ENOUGH_DATA)
      networkState: v.networkState,
      duration: v.duration,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight,
      paused: v.paused,
      muted: v.muted,
      currentTime: v.currentTime,
      poster: v.getAttribute("poster"),
      loop: v.loop,
    };
  });

  // frame fingerprint: sample the actual pixels being displayed
  const frame = await page.screenshot({
    path: "scripts/speaking-forensic-frame.png",
    type: "png",
  });

  await browser.close();
  console.log(JSON.stringify({ net, state, frameBytes: frame.length, errors }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
