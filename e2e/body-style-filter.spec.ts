import { test, expect } from "@playwright/test";

const BASE = "/lexus-showroom/";

test.describe("body-style lineup filters", () => {
  test("sedan chip hides NX/RX/LX and keeps ES", async ({ page }) => {
    await page.goto(BASE);

    const models = page.locator("#models");
    await models.scrollIntoViewIfNeeded();

    const filter = page.getByRole("radiogroup", {
      name: /filter lineup by body style/i,
    });
    await expect(filter).toBeVisible();
    await filter.getByRole("radio", { name: "Sedan" }).click();

    await expect(page).toHaveURL(/#filter=sedan$/);
    await expect(models.getByRole("heading", { name: "Lexus ES" })).toBeVisible();
    await expect(models.getByRole("heading", { name: "Lexus NX" })).toHaveCount(0);
    await expect(models.getByRole("heading", { name: "Lexus RX" })).toHaveCount(0);
    await expect(models.getByRole("heading", { name: "Lexus LX" })).toHaveCount(0);

    // Compare section remains independent of the lineup filter.
    await expect(page.locator("#compare")).toBeVisible();
    await expect(page.getByLabel("Compare model A")).toBeVisible();
  });

  test("deep link #filter=suv shows only SUVs", async ({ page }) => {
    await page.goto(`${BASE}#filter=suv`);
    const models = page.locator("#models");
    await expect(models.getByRole("heading", { name: "Lexus ES" })).toHaveCount(0);
    await expect(models.getByRole("heading", { name: "Lexus NX" })).toBeVisible();
    await expect(models.getByRole("heading", { name: "Lexus RX" })).toBeVisible();
    await expect(models.getByRole("heading", { name: "Lexus LX" })).toBeVisible();
  });
});
