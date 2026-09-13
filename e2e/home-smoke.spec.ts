import { test, expect } from "@playwright/test";

const BASE = "/lexus-showroom/";

test.describe("home smoke under Pages base path", () => {
  test("home loads, nav works, main JS/CSS resolve under base", async ({
    page,
  }) => {
    const failedAssets: string[] = [];

    page.on("response", (response) => {
      const url = response.url();
      const isAsset =
        url.includes(`${BASE}assets/`) &&
        (url.endsWith(".js") ||
          url.endsWith(".css") ||
          url.includes(".js?") ||
          url.includes(".css?"));
      if (isAsset && response.status() >= 400) {
        failedAssets.push(`${response.status()} ${url}`);
      }
    });

    await page.goto(BASE);

    await expect(page).toHaveTitle(/Lexus Showroom/i);
    await expect(page.locator("#home")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const stylesheet = page.locator(
      `link[rel="stylesheet"][href*="${BASE}assets/"]`,
    );
    const entryScript = page.locator(`script[src*="${BASE}assets/"]`);
    await expect(stylesheet).toHaveCount(1);
    await expect(entryScript).toHaveCount(1);

    const cssHref = await stylesheet.getAttribute("href");
    const jsSrc = await entryScript.getAttribute("src");
    expect(cssHref).toMatch(new RegExp(`^${BASE}assets/`));
    expect(jsSrc).toMatch(new RegExp(`^${BASE}assets/`));

    const cssRes = await page.request.get(cssHref!);
    const jsRes = await page.request.get(jsSrc!);
    expect(cssRes.ok(), `CSS must load: ${cssHref}`).toBeTruthy();
    expect(jsRes.ok(), `JS must load: ${jsSrc}`).toBeTruthy();

    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Models" })).toBeVisible();
    await nav.getByRole("link", { name: "Models" }).click();
    await expect(page.locator("#models")).toBeInViewport();

    expect(failedAssets, failedAssets.join("\n")).toEqual([]);
  });
});
