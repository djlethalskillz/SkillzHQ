/**
 * Speaking chapter QA harness — mirrors the locked-chapter QA grammar.
 * Checks: expand/collapse, loop playback, overflow, evidence cards, regressions.
 * Usage: node scripts/speaking-qa.mjs
 */
import puppeteer from "puppeteer-core";

const URL = "http://localhost:3000";
const WAIT = 2400; // expand transition settle
const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });
  const out = [];
  for (const vp of [
    { name: "desktop", w: 1440, h: 900 },
    { name: "tablet", w: 1024, h: 768 },
    { name: "mobile", w: 390, h: 844 },
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.w, height: vp.h, isMobile: vp.name === "mobile" });
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

    await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });

    // overflow check
    const overflow = await page.evaluate(() => ({
      x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rows: [...document.querySelectorAll("#what-i-do li")].map(
        (li) => li.querySelector("button")?.textContent?.trim().split("\n")[0],
      ),
    }));

    // Speaking expand
    const speakingBtn = await page.evaluateHandle(() =>
      [...document.querySelectorAll("#what-i-do li button")].find(
        (b) => b.textContent.includes("Speaking"),
      ),
    );
    await speakingBtn.asElement().click();
    await new Promise((r) => setTimeout(r, WAIT));

    const state = await page.evaluate(() => {
      const panel = document.querySelector("#speaking-archive-panel");
      return {
        expanded: panel?.getAttribute("style")?.includes("1fr") ?? false,
        // REV 8: hero video removed — expect zero video elements in the panel
        videoCount: [...document.querySelectorAll("#speaking-archive-panel video")].length,
        cards: [...document.querySelectorAll("#speaking-archive-panel article h4")].map(
          (h) => h.textContent,
        ),
        documented:
          [...document.querySelectorAll("#speaking-archive-panel h4")]
            .map((h) => h.textContent)
            .includes("We'll Play till We Die") &&
          [...document.querySelectorAll("#speaking-archive-panel img")].filter(
            (i) => i.getAttribute("src")?.includes("DOCUMENTED"),
          ).length === 1,
        evidenceImgs: [...document.querySelectorAll("#speaking-archive-panel article img")].length,
        moments: [...document.querySelectorAll("#speaking-archive-panel h3")]
          .map((h) => h.textContent)
          .includes("Created Moments"),
        signatureTitle:
          [...document.querySelectorAll("#speaking-archive-panel h3")]
            .map((h) => h.textContent)
            .includes("Cultural Guide") &&
          !document.body.innerHTML.includes("Principal Cultural Guide"),
        signatureKicker: [...document.querySelectorAll("#speaking-archive-panel p")]
          .map((p) => p.textContent)
          .includes("Signature — The Voice"),
        teachingCollage: [...document.querySelectorAll("#speaking-archive-panel article img")]
          .map((i) => i.getAttribute("src"))
          .filter((s) => s?.includes("TEACH_")).length >= 5,
        // REV 10: five user-approved speaking archive images
        ctFive: [...document.querySelectorAll("#speaking-archive-panel article img")]
          .map((i) => i.getAttribute("src"))
          .filter((s) => s?.includes("SPEAKING_EVIDENCE_SPEAKING_")).length === 5,
        // REV 12: six equal blocks — five approved speaking images + Tegas stage photo
        sixImgs: [...document.querySelectorAll("#speaking-archive-panel article img")]
          .map((i) => i.getAttribute("src"))
          .filter((s) => s?.includes("SPEAKING_EVIDENCE_SPEAKING_") || s?.includes("TEGAS")).length === 6,
        // REV 12: two clean rows of three — grid-cols-3, no span overrides
        wiefGrid: (() => {
          const g = [...document.querySelectorAll("#speaking-archive-panel article .grid")].find(
            (x) => x.querySelector("img[src*='SPEAKING_EVIDENCE_SPEAKING_']"),
          );
          return {
            cols3: g?.className.includes("grid-cols-3") ?? false,
            spans1: g
              ? [...g.querySelectorAll("img")].every((i) => !i.className.includes("col-span-2"))
              : false,
            count: g ? g.querySelectorAll("img").length : 0,
          };
        })(),
        // REV 8: weak video stills must be gone
        noWeakStills: !document.body.innerHTML.includes("FORUM_SPEAKING"),
        // REV 9: WIEF group photo companion removed — negative space over weak evidence
        noWiefGroup: !document.body.innerHTML.includes("SPEAKING_EVIDENCE_WIEF_GROUP"),
        // REV 9: repetitive event poster removed
        noEventPoster: !document.body.innerHTML.includes("EVENT_POSTER"),
        wiefKicker: document.body.innerHTML.includes("CULTURE × CONVERSATIONS"),
        signaturePrimary: document.body.innerHTML.includes("Hip-Hoppin' Asia"),
        signatureLink: (() => {
          const a = [...document.querySelectorAll("#speaking-archive-panel a")].find(
            (x) => x.href === "https://youtu.be/3VTjjMsJeKQ",
          );
          return {
            found: !!a,
            target: a?.target ?? null,
            rel: a?.rel ?? null,
            text: a?.textContent ?? null,
          };
        })(),
        signatureDetail:
          document.body.innerHTML.includes("8TV Malaysia · Season 2") &&
          !document.body.innerHTML.includes("Principal cultural guide"),
        noNav: !document.body.innerHTML.includes("Somethin Like That with Nav"),
        emDashZero: !panel?.textContent?.includes("—"),
        dmcStack: [...document.querySelectorAll("#speaking-archive-panel article img")]
          .map((i) => i.getAttribute("src"))
          .filter((s) => s?.includes("DMC_QBERT") || s?.includes("DMC_BADGE")).length === 2,
        topics:
          document.body.innerHTML.includes("Technology / creator economy") &&
          document.body.innerHTML.includes("Creative entrepreneurship") &&
          !document.body.innerHTML.includes("Web3 / creator economy"),
        emDashCount: document.querySelector("#speaking-archive-panel")?.textContent
          .split("—").length - 1, // expect 0 — strict rev 6 rule
        wiefArtifact:
          [...document.querySelectorAll("#speaking-archive-panel article span")]
            .map((s) => s.textContent)
            .includes("World Islamic Economic Forum") && !document.body.innerHTML.includes("SPEAKING_EVIDENCE_WIEF.webp"),
        raisingClean: !document.body.innerHTML.includes("Flizzow") && !document.body.innerHTML.includes("SonaOne"),
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        panelText: panel?.textContent?.slice(0, 200) ?? "",
      };
    });

    // screenshot expanded
    await page.screenshot({ path: `scripts/speaking-${vp.name}-expanded.png` });

    // collapse + regression: DJ and Producer still expand cleanly
    await speakingBtn.asElement().click();
    await new Promise((r) => setTimeout(r, 800));
    const djBtn = await page.evaluateHandle(() =>
      [...document.querySelectorAll("#what-i-do li button")].find((b) =>
        b.textContent.trimStart().startsWith("DJ"),
      ),
    );
    await djBtn.asElement().click();
    await new Promise((r) => setTimeout(r, WAIT));
    const djState = await page.evaluate(() => {
      const vids = [...document.querySelectorAll("#dj-archive-panel video")];
      return {
        playing: vids.filter((v) => v.currentTime > 0.1 && !v.paused).length,
        total: vids.length,
        time: vids[0]?.currentTime ?? null,
      };
    });

    const prodBtn = await page.evaluateHandle(() =>
      [...document.querySelectorAll("#what-i-do li button")].find((b) =>
        b.textContent.trimStart().startsWith("Producer"),
      ),
    );
    await prodBtn.asElement().click();
    await new Promise((r) => setTimeout(r, WAIT));
    const prodState = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll("#producer-archive-panel img")];
      return { cards: imgs.length, loaded: imgs.filter((i) => i.naturalWidth > 0).length };
    });
    await page.screenshot({ path: `scripts/speaking-${vp.name}-producer-reg.png` });

    // Turntablism regression: living loop plays
    const ttBtn = await page.evaluateHandle(() =>
      [...document.querySelectorAll("#what-i-do li button")].find((b) =>
        b.textContent.trimStart().startsWith("Turntablism"),
      ),
    );
    await ttBtn.asElement().click();
    await new Promise((r) => setTimeout(r, WAIT));
    const ttState = await page.evaluate(() => {
      const v = document.querySelector("#turntablism-archive-panel video");
      return { playing: v ? v.currentTime > 0.1 && !v.paused : false, time: v?.currentTime ?? null };
    });

    // Booking: Speaking formats render + CTA composes
    const bookBtn = await page.evaluateHandle(() =>
      [...document.querySelectorAll("#book button")].find((b) =>
        b.textContent.includes("Book Skillz"),
      ),
    );
    await bookBtn.asElement().click();
    await new Promise((r) => setTimeout(r, 800));
    const speakCat = await page.evaluateHandle(() =>
      [...document.querySelectorAll("#book-skillz-panel button")].find((b) =>
        b.textContent.trimStart().startsWith("Speaking"),
      ),
    );
    await speakCat.asElement().click();
    await new Promise((r) => setTimeout(r, 500));
    const bookingState = await page.evaluate(() => {
      const rows = [...document.querySelectorAll("#book-skillz-panel ul li button")].map(
        (b) => b.textContent.trim().split("\n")[0],
      );
      const cta = [...document.querySelectorAll("#book-skillz-panel a, #book-skillz-panel button")]
        .map((b) => b.textContent?.trim() ?? "")
        .find((t) => t.startsWith("Book Skillz —"));
      return { rows, cta };
    });
    await page.screenshot({ path: `scripts/speaking-${vp.name}-booking.png` });

    out.push({ vp: vp.name, overflow, state, djState, ttState, prodState, bookingState, errors });
    await page.close();
  }
  await browser.close();

  // external URL reachability — official Hip-Hoppin' Asia episode
  let linkHttp = null;
  try {
    const res = await fetch("https://youtu.be/3VTjjMsJeKQ", { method: "HEAD", redirect: "follow" });
    linkHttp = res.status;
  } catch (e) {
    linkHttp = "ERR " + e.message;
  }
  out.push({ linkHttp });

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
