import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** axe-core (WCAG 2.0/2.1 A and AA rules) on every route: no violations allowed. */
const ROUTES = [
  "/", "/book", "/life-archive", "/bandcamp", "/this-page-does-not-exist",
  ...Array.from({ length: 10 }, (_, i) => `/life-archive/${String(i + 1).padStart(2, "0")}`),
];

for (const route of ROUTES) {
  test(`axe ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    // Scroll through once so scroll-revealed content is present, then back to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes[0]?.target.join(" ")}`);
    expect(summary, `axe violations on ${route}`).toEqual([]);
  });
}
