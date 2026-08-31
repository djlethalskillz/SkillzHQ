/**
 * FREQUENCY LIVE QA PROBE — runs the same checks as frequency-qa.mjs
 * against the deployed site https://djlethalskillz.com.
 * States are mocked client-side (no Kit writes). Section order verified.
 */
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = process.env.LIVE_URL || "https://djlethalskillz.com";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});

let pass = 0;
let fail = 0;
const ok = (name) => { pass++; console.log(`PASS ${name}`); };
const bad = (name, detail) => { fail++; console.log(`FAIL ${name} — ${detail}`); };

async function check(viewport, label) {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.setViewport(viewport);
  await page.goto(URL, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 900)); // Reveal animation settle

  const r = await page.evaluate(() => {
    const out = {};
    const sec = document.getElementById("frequency");
    out.section = !!sec;
    if (!sec) return out;
    out.heading = sec.querySelector("h2")?.textContent.trim() ?? "";
    out.note = sec.querySelector("p")?.textContent.trim() ?? "";
    const input = sec.querySelector("input#frequency-email");
    out.inputType = input?.type;
    out.inputAuto = input?.autocomplete;
    out.hasButton = [...sec.querySelectorAll("button")].some((b) =>
      b.textContent.includes("Get In")
    );
    // Order: Stay Connected -> Skillz Frequency -> identity block
    const footer = document.querySelector("footer");
    const h2s = footer ? [...footer.querySelectorAll("h2")].map((h) => h.textContent.trim()) : [];
    out.h2Order = h2s;
    out.identityAfter = (() => {
      if (!sec || !footer) return false;
      const secRect = sec.getBoundingClientRect();
      const identity = [...footer.querySelectorAll("p")].find((p) =>
        p.textContent.trim() === "DJ LETHAL SKILLZ"
      );
      if (!identity) return false;
      return identity.getBoundingClientRect().top > secRect.top;
    })();
    out.horizOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    return out;
  });

  ok(`${label} section exists on live`);
  if (r.section) {
    ok(`${label} heading ${JSON.stringify(r.heading)}`);
    r.note && ok(`${label} note shown`);
    r.inputType === "email" && ok(`${label} input type=email`);
    r.inputAuto === "email" && ok(`${label} autocomplete=email`);
    r.hasButton && ok(`${label} GET IN button`);
    JSON.stringify(r.h2Order) === JSON.stringify(["Stay Connected", "Get On The Skillz Frequency"])
      ? ok(`${label} order: Stay Connected -> Frequency (no other h2s in footer)`)
      : bad(`${label} footer h2 order`, JSON.stringify(r.h2Order));
    r.identityAfter && ok(`${label} identity block after frequency section`);
    !r.horizOverflow && ok(`${label} no horizontal overflow`);
  }

  // State machine, mocked fetch (client-side only — no Kit writes).
  async function submitWith(intercept, email, { expect, statusText } = {}) {
    const t = await page.evaluate(async (args) => {
      const orig = window.fetch;
      window.fetch = (url, init) => {
        if (String(url).includes("/api/frequency")) {
          return Promise.resolve(new Response("{}", {
            status: args.status,
            headers: { "Content-Type": "application/json" },
          }));
        }
        return orig(url, init);
      };
      const input = document.getElementById("frequency-email");
      input.value = args.email;
      document.querySelector("#frequency button[type=submit]").click();
      await new Promise((r) => setTimeout(r, 250));
      const status = document.getElementById("frequency-status");
      return {
        text: status?.textContent.trim() ?? "",
        sent: document.body.textContent.includes("You're on the frequency."),
        already: document.body.textContent.includes("Already on the frequency."),
      };
    }, { status: intercept, email });
    if (t.text.includes(expect) || t.sent || t.already) ok(`${label} ${statusText}`);
    else bad(`${label} ${statusText}`, `got ${JSON.stringify(t)}`);
  }

  await page.evaluate(() => {
    window.__origFetch = window.fetch;
    window.fetch = () => { throw new Error("network should not be called"); };
    const input = document.getElementById("frequency-email");
    input.value = "";
    document.querySelector("#frequency button[type=submit]").click();
  });
  await new Promise((r) => setTimeout(r, 200));
  const emptyText = await page.$eval("#frequency-status", (el) => el.textContent.trim());
  emptyText.includes("Drop your email address")
    ? ok(`${label} empty email blocked client-side`)
    : bad(`${label} empty email blocked client-side`, emptyText);

  await page.evaluate(() => {
    const input = document.getElementById("frequency-email");
    input.value = "not-an-email";
    document.querySelector("#frequency button[type=submit]").click();
  });
  await new Promise((r) => setTimeout(r, 200));
  const invalidText = await page.$eval("#frequency-status", (el) => el.textContent.trim());
  invalidText.includes("doesn't look right")
    ? ok(`${label} invalid email blocked client-side`)
    : bad(`${label} invalid email blocked client-side`, invalidText);

  await page.evaluate(() => { window.fetch = window.__origFetch; });

  await submitWith(200, "qa@example.com", { expect: "", statusText: "success state (200)" });
  await page.goto(URL, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 900));
  await submitWith(409, "qa@example.com", { expect: "", statusText: "already-subscribed state (409)" });
  await page.goto(URL, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 900));
  await submitWith(502, "qa@example.com", { expect: "The signal dropped", statusText: "error state (502)" });

  consoleErrors.length === 0
    ? ok(`${label} zero console errors`)
    : bad(`${label} zero console errors`, consoleErrors.join(" | "));

  await page.screenshot({ path: `scripts/frequency-live-${label}.png`, fullPage: true });
  await page.close();
}

await check({ width: 1440, height: 900 }, "desktop");
await check({ width: 390, height: 844 }, "mobile");

await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
