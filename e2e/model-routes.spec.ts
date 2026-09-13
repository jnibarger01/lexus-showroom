import { test, expect } from "@playwright/test";

const BASE = "/lexus-showroom/";

test.describe("per-model hash routes", () => {
  test("direct model URL selects the vehicle and shows the showroom", async ({
    page,
  }) => {
    await page.goto(`${BASE}#rx`);

    await expect(page).toHaveTitle(/Lexus RX \| Lexus Showroom/);
    await expect(page).toHaveURL(/#rx$/);

    const showroomGroup = page.getByRole("group", {
      name: /choose a vehicle for the 3d viewer/i,
    });
    await expect(
      showroomGroup.getByRole("button", { name: "RX", pressed: true }),
    ).toBeVisible();
    await expect(page.locator("#showroom")).toBeInViewport();
    await expect(page.getByText("Currently selected in the showroom")).toBeVisible();
  });

  test("navbar model link pushes history so Back returns home", async ({
    page,
  }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/^Lexus Showroom$/);

    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: "RX", exact: true }).click();

    await expect(page).toHaveURL(/#rx$/);
    await expect(page).toHaveTitle(/Lexus RX \| Lexus Showroom/);
    await expect(page.locator("#showroom")).toBeInViewport();

    await page.goBack();

    await expect(page).toHaveURL(/\/lexus-showroom\/(?:#home)?$/);
    await expect(page).toHaveTitle(/^Lexus Showroom$/);
    await expect(page.locator("#home")).toBeInViewport();
  });

  test("compare deep link still works", async ({ page }) => {
    await page.goto(`${BASE}#compare=es,lx`);
    await expect(page.getByLabel("Compare model A")).toHaveValue("es");
    await expect(page.getByLabel("Compare model B")).toHaveValue("lx");
  });
});
