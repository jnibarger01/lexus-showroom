import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { vehicles } from "./data/vehicles";
import { PAGES_ORIGIN } from "./seo";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = resolve(ROOT, "public");
const DIST = resolve(ROOT, "dist");

const SITE_BASE = `${PAGES_ORIGIN}/lexus-showroom`;

describe("robots.txt and sitemap.xml", () => {
  it("ships crawl files under public/ with Pages origin + base", () => {
    const robots = readFileSync(resolve(PUBLIC, "robots.txt"), "utf8");
    expect(robots).toMatch(/Allow:\s*\/lexus-showroom\//);
    expect(robots).toContain(`Sitemap: ${SITE_BASE}/sitemap.xml`);

    const sitemap = readFileSync(resolve(PUBLIC, "sitemap.xml"), "utf8");
    expect(sitemap).toContain(`${SITE_BASE}/`);
    for (const vehicle of vehicles) {
      expect(sitemap).toContain(`${SITE_BASE}/#${vehicle.id}`);
    }
  });

  it("copies crawl files into dist after build (when dist exists)", () => {
    // Soft assertion: only when a local/CI build has produced dist/.
    if (!existsSync(DIST)) return;
    expect(existsSync(resolve(DIST, "robots.txt"))).toBe(true);
    expect(existsSync(resolve(DIST, "sitemap.xml"))).toBe(true);
    const robots = readFileSync(resolve(DIST, "robots.txt"), "utf8");
    expect(robots).toContain(`Sitemap: ${SITE_BASE}/sitemap.xml`);
  });
});
