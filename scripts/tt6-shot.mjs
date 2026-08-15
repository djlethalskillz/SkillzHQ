/** REV T6 visual inspection screenshots — Turntablism expanded, desktop + mobile. */
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });
  for (const vp of [
    { name: "desktop", w: 1440, h: 900 },
    { name: "mobile", w: 390, h: 844 },
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.w, height: vp.h, isMobile: vp.name === "mobile" });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 60000 });
    const ttBtn = await page.evaluateHandle(() =>
      [...document.querySelectorAll("#what-i-do li button")].find((b) =>
        b.textContent.trimStart().startsWith("Turntablism"),
      ),
    );
    await ttBtn.asElement().click();
    await new Promise((r) => setTimeout(r, 2400));
    await page.screenshot({ path: `scripts/tt6-${vp.name}.png` });
    await page.close();
  }
  await browser.close();
  console.log("tt6 screenshots done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
