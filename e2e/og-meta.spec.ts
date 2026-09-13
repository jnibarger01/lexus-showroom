import { test, expect } from "@playwright/test";

const BASE = "/lexus-showroom/";

test.describe("Open Graph + SEO meta", () => {
  test("home keeps default title and absolute Pages-base OG url", async ({
    page,
  }) => {
    await page.goto(BASE);

    await expect(page).toHaveTitle(/^Lexus Showroom$/);
    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute("content", /\/lexus-showroom\/$/);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /ES, RX, NX, and LX/i);
  });

  test("vehicle hash route unfurls model title and tagline", async ({
    page,
  }) => {
    await page.goto(`${BASE}#rx`);

    await expect(page).toHaveTitle(/Lexus RX \| Lexus Showroom/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Lexus RX | Lexus Showroom",
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      "content",
      "The original luxury SUV, tuned for every drive.",
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      /\/lexus-showroom\/#rx$/,
    );
  });

  test("selecting a lineup model updates title and hash", async ({ page }) => {
    await page.goto(BASE);
    await page.getByRole("button", { name: "View specs for Lexus NX" }).click();

    await expect(page).toHaveTitle(/Lexus NX \| Lexus Showroom/);
    await expect(page).toHaveURL(/#nx$/);
  });
});
