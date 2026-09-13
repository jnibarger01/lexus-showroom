import { test, expect } from "@playwright/test";

const BASE = "/lexus-showroom/";

test.describe("home smoke under Pages base path", () => {
  test("home loads, nav works, main JS/CSS resolve under base", async ({
    page,
  }) => {
    const failedAssets: string[] = [];
    const threeishRequests: string[] = [];

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

    page.on("request", (request) => {
      const url = request.url();
      const isGlb = url.includes(`${BASE}models/`) && url.includes(".glb");
      const isShowroomChunk =
        url.includes(`${BASE}assets/`) && url.includes("CarShowroom3D");
      if (isGlb || isShowroomChunk) {
        threeishRequests.push(url);
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

    // First paint path: 3D chunk / GLB must not have been requested yet.
    await expect(
      page.getByRole("button", { name: /load 3d view/i }),
    ).toBeVisible();
    expect(
      threeishRequests,
      `3D assets fetched before intent:\n${threeishRequests.join("\n")}`,
    ).toEqual([]);

    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Models" })).toBeVisible();
    await nav.getByRole("link", { name: "Models" }).click();
    await expect(page.locator("#models")).toBeInViewport();

    // Near-viewport intent: IntersectionObserver mounts the lazy canvas
    // (button click is the other gate — covered by unit tests).
    await page.locator("#showroom").scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("button", { name: /load 3d view/i }),
    ).toHaveCount(0, { timeout: 10_000 });
    await expect(page.getByText(/interactive 3d/i).first()).toBeVisible();
    await expect(page.locator('[data-testid="lazy-showroom-3d"]')).toBeVisible();

    expect(failedAssets, failedAssets.join("\n")).toEqual([]);
  });
});
