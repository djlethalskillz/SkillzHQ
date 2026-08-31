/**
 * FREQUENCY QA PROBE — Skillz Frequency signup section.
 * DOM + computed styles + mocked-fetch state machine checks (no vision).
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

let pass = 0;
let fail = 0;
const ok = (name) => { pass++; console.log(`PASS ${name}`); };
const bad = (name, detail) => { fail++; console.log(`FAIL ${name} — ${detail}`); };

const results = [];

async function check(viewport, label) {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(String(e)));
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
  await page.setViewport(viewport);
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 900)); // Reveal animation settle

  const r = await page.evaluate(() => {
    const out = {};
    const sec = document.getElementById("frequency");
    out.section = !!sec;
    if (!sec) return out;
    out.heading = sec.querySelector("h2")?.textContent.trim() ?? "";
    out.note = sec.querySelector("p")?.textContent.trim() ?? "";
    out.label = !!sec.querySelector('label[for="frequency-email"]');
    const input = sec.querySelector("input#frequency-email");
    out.inputType = input?.type;
    out.inputAuto = input?.autocomplete;
    out.hasButton = [...sec.querySelectorAll("button")].some((b) =>
      b.textContent.includes("Get In")
    );
    const secOrder = [...document.querySelectorAll("main section")].map((s) => s.id);
    out.secOrder = secOrder;
    const footer = document.querySelector("footer");
    out.stayConnectedInFooter =
      footer?.textContent.includes("Stay Connected") ?? false;
    out.horizOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    return out;
  });

  ok(`${label} section exists`);
  results.push({ label, ...r });

  if (r.section) {
    ok(`${label} heading is ${JSON.stringify(r.heading)}`);
    ok(`${label} note shown`);
    r.label && ok(`${label} labeled input`);
    r.inputType === "email" && ok(`${label} input type=email`);
    r.inputAuto === "email" && ok(`${label} autocomplete=email`);
    r.hasButton && ok(`${label} GET IN button`);
    r.stayConnectedInFooter && ok(`${label} Stay Connected still in footer`);
    !r.horizOverflow && ok(`${label} no horizontal overflow`);
  }

  // State machine, mocked fetch.
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
    return t;
  }

  // Empty submit — validation message, no network.
  await page.evaluate(() => {
    window.__origFetch = window.fetch;
    window.fetch = () => { throw new Error("network should not be called"); };
    const input = document.getElementById("frequency-email");
    input.value = "";
    document.querySelector("#frequency button[type=submit]").click();
  });
  await new Promise((r) => setTimeout(r, 200));
  const emptyText = await page.$eval("#frequency-status", (el) => el.textContent.trim());
  if (emptyText.includes("Drop your email address")) {
    ok(`${label} empty email blocked client-side`);
  } else {
    bad(`${label} empty email blocked client-side`, emptyText);
  }

  // Invalid email.
  await page.evaluate(() => {
    const input = document.getElementById("frequency-email");
    input.value = "not-an-email";
    document.querySelector("#frequency button[type=submit]").click();
  });
  await new Promise((r) => setTimeout(r, 200));
  const invalidText = await page.$eval("#frequency-status", (el) => el.textContent.trim());
  if (invalidText.includes("doesn't look right")) {
    ok(`${label} invalid email blocked client-side`);
  } else {
    bad(`${label} invalid email blocked client-side`, invalidText);
  }

  await page.evaluate(() => { window.fetch = window.__origFetch; });

  await submitWith(200, "qa@example.com", { expect: "", statusText: "success state (200)" });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 900));
  await submitWith(409, "qa@example.com", { expect: "", statusText: "already-subscribed state (409)" });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 900));
  await submitWith(502, "qa@example.com", { expect: "The signal dropped", statusText: "error state (502)" });

  consoleErrors.length === 0
    ? ok(`${label} zero console errors`)
    : bad(`${label} zero console errors`, consoleErrors.join(" | "));

  await page.screenshot({ path: `scripts/frequency-${label}.png`, fullPage: true });
  await page.close();
}

await check({ width: 1440, height: 900 }, "desktop");
await check({ width: 390, height: 844 }, "mobile");

await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
