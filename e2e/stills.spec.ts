import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "/lexus-showroom/";
const IDS = ["es", "nx", "rx", "lx"] as const;

const here = dirname(fileURLToPath(import.meta.url));
const stillsDir = join(here, "..", "public", "stills");

test.describe("per-model stills under Pages base path", () => {
  test("each model still URL resolves (1x and @2x)", async ({ page }) => {
    await page.goto(BASE);

    for (const id of IDS) {
      const src = `${BASE}stills/${id}.svg`;
      const src2x = `${BASE}stills/${id}@2x.svg`;

      const res1 = await page.request.get(src);
      expect(res1.ok(), `1x still must resolve: ${src}`).toBeTruthy();
      expect(res1.headers()["content-type"] ?? "").toMatch(/svg|xml/i);

      const res2 = await page.request.get(src2x);
      expect(res2.ok(), `2x still must resolve: ${src2x}`).toBeTruthy();
      expect(res2.headers()["content-type"] ?? "").toMatch(/svg|xml/i);
    }
  });

  test("lineup cards expose distinct stills with vehicle-name alt", async ({
    page,
  }) => {
    await page.goto(BASE);
    await page.locator("#models").scrollIntoViewIfNeeded();

    const alts = new Set<string>();
    for (const id of IDS) {
      const img = page.getByTestId(`still-${id}`);
      await expect(img).toBeVisible();
      const alt = await img.getAttribute("alt");
      expect(alt).toMatch(new RegExp(`Lexus ${id}`, "i"));
      alts.add(alt ?? "");
      const src = await img.getAttribute("src");
      expect(src).toBe(`${BASE}stills/${id}.svg`);
      const srcset = await img.getAttribute("srcset");
      expect(srcset).toContain(`${BASE}stills/${id}.svg 1x`);
      expect(srcset).toContain(`${BASE}stills/${id}@2x.svg 2x`);
    }
    expect(alts.size).toBe(4);
  });

  test("placeholder still files exist on disk for CI packaging", () => {
    for (const id of IDS) {
      const one = readFileSync(join(stillsDir, `${id}.svg`), "utf8");
      const two = readFileSync(join(stillsDir, `${id}@2x.svg`), "utf8");
      expect(one).toMatch(/<svg/i);
      expect(two).toMatch(/<svg/i);
      expect(one).toMatch(new RegExp(id, "i"));
    }
  });
});
