/**
 * Performance budget for the GitHub Pages home (`/lexus-showroom/`).
 *
 * 1. Gzip size of the initial (non-lazy) JS/CSS in dist/ — fails a huge unused
 *    sync script with a readable table, even if Lighthouse is noisy.
 * 2. One Lighthouse performance run (desktop) asserting LCP + TBT.
 *
 * Complements lazy-load 3D (#9); does not replace it.
 *
 * Usage (after `npm run build`):
 *   npm run test:perf
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import * as chromeLauncher from "chrome-launcher";
import lighthouse, { desktopConfig } from "lighthouse";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const BUDGET_PATH = join(ROOT, "lighthouse-budget.json");
const REPORT_PATH = join(ROOT, "lighthouse-report.json");
const HUGE_SYNC_JS_GZIP = 500 * 1024;

function loadBudget() {
  return JSON.parse(readFileSync(BUDGET_PATH, "utf8"));
}

function fmtKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function pad(value, width) {
  return String(value).padEnd(width);
}

function padStart(value, width) {
  return String(value).padStart(width);
}

function parseEntryAssets(html) {
  const jsMatch = html.match(/<script[^>]+src="([^"]*assets\/[^"]+\.js)"/);
  const cssMatch = html.match(
    /<link[^>]+rel="stylesheet"[^>]+href="([^"]*assets\/[^"]+\.css)"/,
  );
  if (!jsMatch || !cssMatch) {
    throw new Error(
      "Could not find entry JS/CSS in dist/index.html. Did the Vite build change?",
    );
  }
  return {
    jsHref: jsMatch[1],
    cssHref: cssMatch[1],
    jsFile: jsMatch[1].replace(/^.*assets\//, ""),
    cssFile: cssMatch[1].replace(/^.*assets\//, ""),
  };
}

function gzipSize(filePath) {
  return gzipSync(readFileSync(filePath)).length;
}

function measureEntryAssets() {
  const htmlPath = join(DIST, "index.html");
  if (!existsSync(htmlPath)) {
    throw new Error("Missing dist/index.html. Run `npm run build` first.");
  }
  const parsed = parseEntryAssets(readFileSync(htmlPath, "utf8"));
  const jsPath = join(DIST, "assets", parsed.jsFile);
  const cssPath = join(DIST, "assets", parsed.cssFile);
  if (!existsSync(jsPath) || !existsSync(cssPath)) {
    throw new Error(
      `Entry assets missing under dist/assets (${parsed.jsFile}, ${parsed.cssFile}).`,
    );
  }
  return {
    ...parsed,
    entryJsGzip: gzipSize(jsPath),
    entryCssGzip: gzipSize(cssPath),
    entryJsRaw: readFileSync(jsPath).length,
    entryCssRaw: readFileSync(cssPath).length,
  };
}

function evaluateAssets(measured, budget) {
  return [
    {
      name: "entry JS gzip",
      actual: measured.entryJsGzip,
      limit: budget.assets.entryJsGzipBytes,
      unit: "bytes",
      detail: measured.jsFile,
    },
    {
      name: "entry CSS gzip",
      actual: measured.entryCssGzip,
      limit: budget.assets.entryCssGzipBytes,
      unit: "bytes",
      detail: measured.cssFile,
    },
  ].map((row) => ({ ...row, ok: row.actual <= row.limit }));
}

function evaluateLighthouse(lhr, budget) {
  const lcp = lhr.audits["largest-contentful-paint"]?.numericValue;
  const tbt = lhr.audits["total-blocking-time"]?.numericValue;
  if (typeof lcp !== "number" || typeof tbt !== "number") {
    throw new Error("Lighthouse report missing LCP or TBT numericValue.");
  }
  return [
    {
      name: "LCP",
      actual: lcp,
      limit: budget.lighthouse.lcpMs,
      unit: "ms",
      detail: lhr.audits["largest-contentful-paint"]?.displayValue ?? "",
    },
    {
      name: "TBT",
      actual: tbt,
      limit: budget.lighthouse.tbtMs,
      unit: "ms",
      detail: lhr.audits["total-blocking-time"]?.displayValue ?? "",
    },
  ].map((row) => ({ ...row, ok: row.actual <= row.limit }));
}

function printTable(title, rows, formatActual) {
  console.log(`\n${title}`);
  const nameW = Math.max(16, ...rows.map((r) => r.name.length));
  for (const row of rows) {
    const status = row.ok ? "PASS" : "FAIL";
    const extra = row.detail ? `  ${row.detail}` : "";
    console.log(
      `  ${pad(row.name, nameW)}  ${padStart(formatActual(row), 12)}  / ${padStart(formatActual({ ...row, actual: row.limit }), 10)}  ${status}${extra}`,
    );
  }
}

async function isReady(url) {
  try {
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForUrl(url, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isReady(url)) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview did not become ready: ${url}`);
}

function stopPreview(child) {
  if (!child || child.killed) return;
  try {
    child.kill("SIGTERM");
  } catch {
    // already gone
  }
}

async function ensurePreview(budget) {
  const url = `http://${budget.previewHost}:${budget.previewPort}${budget.urlPath}`;
  if (await isReady(url)) {
    return { url, child: null };
  }
  const viteBin = join(ROOT, "node_modules", "vite", "bin", "vite.js");
  const child = spawn(
    process.execPath,
    [
      viteBin,
      "preview",
      "--host",
      budget.previewHost,
      "--port",
      String(budget.previewPort),
    ],
    {
      cwd: ROOT,
      stdio: "ignore",
    },
  );
  try {
    await waitForUrl(url);
  } catch (error) {
    stopPreview(child);
    throw error;
  }
  return { url, child };
}

async function resolveChromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  if (process.env.LIGHTHOUSE_CHROMIUM_PATH) {
    return process.env.LIGHTHOUSE_CHROMIUM_PATH;
  }
  try {
    const { chromium } = await import("@playwright/test");
    const path = chromium.executablePath();
    if (path && existsSync(path)) return path;
  } catch {
    // chrome-launcher will search the usual Chrome install locations
  }
  return undefined;
}

async function runLighthouse(url) {
  const chromePath = await resolveChromePath();
  const chrome = await chromeLauncher.launch({
    ...(chromePath ? { chromePath } : {}),
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });
  try {
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance"],
      },
      desktopConfig,
    );
    if (!result?.lhr) {
      throw new Error("Lighthouse returned no lhr.");
    }
    return result.lhr;
  } finally {
    await chrome.kill();
  }
}

function printReadableReport({ url, assetRows, lhRows, lhr }) {
  console.log(`\nPerformance budget — ${url}`);
  printTable("Asset sizes (gzip of initial / non-lazy files)", assetRows, (r) =>
    fmtKb(r.actual),
  );
  printTable("Lighthouse (desktop, performance)", lhRows, (r) =>
    `${Math.round(r.actual)} ms`,
  );
  const score = lhr.categories?.performance?.score;
  if (typeof score === "number") {
    console.log(`  performance score          ${(score * 100).toFixed(0)}`);
  }
}

function proveHugeSyncScriptFails(budget) {
  const fake = {
    jsFile: "index-HUGE-SYNC.js",
    cssFile: "index.css",
    entryJsGzip: HUGE_SYNC_JS_GZIP,
    entryCssGzip: 6 * 1024,
  };
  const rows = evaluateAssets(fake, budget);
  const jsRow = rows.find((row) => row.name === "entry JS gzip");
  if (!jsRow || jsRow.ok) {
    throw new Error(
      "Regression proof failed: a 500 KB gzip sync script should exceed the entry JS budget.",
    );
  }
  console.log("\nRegression proof (not served)");
  console.log(
    `  huge unused sync JS   ${fmtKb(HUGE_SYNC_JS_GZIP)}  / ${fmtKb(budget.assets.entryJsGzipBytes)}  FAIL (expected)  ${fake.jsFile}`,
  );
}

async function main() {
  const budget = loadBudget();
  const measured = measureEntryAssets();
  const { url, child } = await ensurePreview(budget);
  let failed = false;
  try {
    const lhr = await runLighthouse(url);
    writeFileSync(REPORT_PATH, JSON.stringify(lhr, null, 2));
    const assetRows = evaluateAssets(measured, budget);
    const lhRows = evaluateLighthouse(lhr, budget);
    printReadableReport({ url, assetRows, lhRows, lhr });
    proveHugeSyncScriptFails(budget);

    const failedRows = [...assetRows, ...lhRows].filter((row) => !row.ok);
    if (failedRows.length) {
      failed = true;
      console.error(
        `\nFAIL — ${failedRows.length} budget${failedRows.length === 1 ? "" : "s"} exceeded.`,
      );
      console.error(
        "A large unused sync script in the initial bundle fails the entry JS gzip budget.",
      );
      console.error(`See ${BUDGET_PATH} and README (Lighthouse budget).`);
      console.error(`Full Lighthouse JSON: ${REPORT_PATH}`);
    } else {
      console.log("\nOK — all budgets met.");
      console.log(`Lighthouse JSON: ${REPORT_PATH}`);
    }
  } finally {
    stopPreview(child);
  }
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
