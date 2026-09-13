/**
 * Capture home + one model (#rx) screenshots for the README contribute guide.
 * Expects a production preview at http://127.0.0.1:4173/lexus-showroom/
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "http://127.0.0.1:4173/lexus-showroom/";
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "docs", "screenshots");

async function captureHome(page) {
  await page.addInitScript(() => {
    localStorage.setItem("lexus-showroom-theme", "light");
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.locator("#home").waitFor();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: join(OUT_DIR, "home.png"),
    fullPage: false,
    animations: "disabled",
  });
}

async function captureModelRx(page) {
  await page.addInitScript(() => {
    localStorage.setItem("lexus-showroom-theme", "dark");
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}#rx`, { waitUntil: "networkidle" });
  await page.locator("#showroom").waitFor();

  // Intent-mount: click Load 3D if the CTA is still up.
  const loadBtn = page.getByRole("button", { name: /load 3d/i });
  if (await loadBtn.isVisible().catch(() => false)) {
    await loadBtn.click();
  }

  // Wait until loading overlay is gone, or canvas appears.
  await Promise.race([
    page.locator("canvas").first().waitFor({ state: "visible", timeout: 20000 }),
    page.getByText(/loading 3d/i).waitFor({ state: "hidden", timeout: 20000 }),
  ]).catch(() => {});
  await page.waitForTimeout(800);

  await page.screenshot({
    path: join(OUT_DIR, "model-rx.png"),
    fullPage: false,
    animations: "disabled",
  });
}

const browser = await chromium.launch();
await mkdir(OUT_DIR, { recursive: true });

const home = await browser.newPage();
await captureHome(home);
await home.close();

const model = await browser.newPage();
await captureModelRx(model);
await model.close();

await browser.close();
console.log(`Wrote ${OUT_DIR}/home.png and model-rx.png`);
