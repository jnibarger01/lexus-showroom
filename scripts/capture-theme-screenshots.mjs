/**
 * Capture light + dark landing screenshots for the brand-theme PR.
 * Expects a production preview at http://127.0.0.1:4173/lexus-showroom/
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "http://127.0.0.1:4173/lexus-showroom/";
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "docs", "screenshots");

async function capture(page, theme, filename) {
  await page.addInitScript((nextTheme) => {
    localStorage.setItem("lexus-showroom-theme", nextTheme);
  }, theme);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.locator("#home").waitFor();
  await page.screenshot({
    path: join(OUT_DIR, filename),
    fullPage: true,
    animations: "disabled",
  });
}

const browser = await chromium.launch();
await mkdir(OUT_DIR, { recursive: true });

const light = await browser.newPage();
await capture(light, "light", "theme-light.png");
await light.close();

const dark = await browser.newPage();
await capture(dark, "dark", "theme-dark.png");
await dark.close();

await browser.close();
console.log(`Wrote ${OUT_DIR}/theme-light.png and theme-dark.png`);
