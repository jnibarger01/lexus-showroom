#!/usr/bin/env node
/**
 * Post-build smoke: Vite must copy public/robots.txt and public/sitemap.xml into dist/.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const origin = "https://jnibarger01.github.io/lexus-showroom";

const robotsPath = resolve(dist, "robots.txt");
const sitemapPath = resolve(dist, "sitemap.xml");

const missing = [robotsPath, sitemapPath].filter((p) => !existsSync(p));
if (missing.length) {
  console.error("Missing crawl files in dist/:", missing.map((p) => p.replace(root + "/", "")).join(", "));
  process.exit(1);
}

const robots = readFileSync(robotsPath, "utf8");
if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`)) {
  console.error("dist/robots.txt missing Pages sitemap URL");
  process.exit(1);
}

const sitemap = readFileSync(sitemapPath, "utf8");
for (const id of ["es", "nx", "rx", "lx"]) {
  if (!sitemap.includes(`${origin}/#${id}`)) {
    console.error(`dist/sitemap.xml missing #${id}`);
    process.exit(1);
  }
}

console.log("crawl files ok:", "dist/robots.txt", "dist/sitemap.xml");
