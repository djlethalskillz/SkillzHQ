import { expect, test, type Page } from "@playwright/test";

/**
 * Screenshot baselines for every locked chapter in scripts/_evi/SKILLZHQ_LOCK_REGISTER.md.
 * Reduced motion and disabled CSS animations give a still, repeatable frame; videos and iframes are
 * masked because their frames are not deterministic. A failing comparison means a locked chapter
 * changed: check the diff in test-results/, and only re-baseline (`npm run qa:update`) for an
 * owner-approved change.
 */

async function ready(page: Page, path: string) {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

async function openChapter(page: Page, panelId: string) {
  const button = page.locator(`button[aria-controls="${panelId}"]`);
  await button.scrollIntoViewIfNeeded();
  if ((await button.getAttribute("aria-expanded")) !== "true") await button.click();
  const panel = page.locator(`#${panelId}`);
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await panel.scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  return panel;
}

const mask = (page: Page) => [page.locator("video"), page.locator("iframe")];

test.describe("locked chapters on the HQ", () => {
  test("L1 Hero", async ({ page }) => {
    await ready(page, "/");
    await expect(page.locator("#landing")).toHaveScreenshot("l1-hero.png", { mask: mask(page) });
  });

  test("L2–L5 chapter list (closed)", async ({ page }) => {
    await ready(page, "/");
    await expect(page.locator("#what-i-do")).toHaveScreenshot("l2-chapter-list.png", { mask: mask(page) });
  });

  for (const [name, panelId] of [
    ["l2-dj", "dj-archive-panel"],
    ["l3-turntablism", "turntablism-archive-panel"],
    ["l4-speaking", "speaking-archive-panel"],
    ["l5-producer", "producer-archive-panel"],
    ["l6-fragments", "fragments-archive-panel"],
  ] as const) {
    test(`${name} (open)`, async ({ page }) => {
      await ready(page, "/");
      const panel = await openChapter(page, panelId);
      await expect(panel).toHaveScreenshot(`${name}.png`, { mask: mask(page) });
    });
  }

  test("L7 Book Skillz (form on the HQ)", async ({ page }) => {
    await ready(page, "/");
    await expect(page.locator("#book")).toHaveScreenshot("l7-book-skillz.png", { mask: mask(page) });
  });

  test("L8 Watch / Listen", async ({ page }) => {
    await ready(page, "/");
    await expect(page.locator("#watch-listen")).toHaveScreenshot("l8-watch-listen.png", { mask: mask(page) });
  });

  test("L11 Anthem + Follow Skillz (footer)", async ({ page }) => {
    await ready(page, "/");
    await expect(page.locator("footer").last()).toHaveScreenshot("l11-footer.png", { mask: mask(page) });
  });
});

test("L7 /book page (amendment A2)", async ({ page }) => {
  await ready(page, "/book");
  await expect(page).toHaveScreenshot("l7-book-page.png", { fullPage: true, mask: mask(page) });
});
