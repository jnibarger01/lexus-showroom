import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { prefersReducedMotion } from "./prefersReducedMotion";

/** Installs a `matchMedia` stub reporting the given reduced-motion preference. */
function stubMatchMedia(reduced: boolean): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("prefers-reduced-motion: reduce") ? reduced : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("prefersReducedMotion", () => {
  it("reports the user's preference", () => {
    stubMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);

    stubMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
  });

  it("returns false when matchMedia is unavailable", () => {
    vi.stubGlobal("matchMedia", undefined);
    expect(prefersReducedMotion()).toBe(false);
  });

  it("re-reads the preference on every call", () => {
    stubMatchMedia(false);
    expect(prefersReducedMotion()).toBe(false);
    stubMatchMedia(true);
    expect(prefersReducedMotion()).toBe(true);
  });
});

describe("CarShowroom3D reduced-motion call sites", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/components/CarShowroom3D.tsx"),
    "utf8",
  );

  it("gates auto-orbit and damping on the preference", () => {
    expect(source).toContain("usePrefersReducedMotion");
    expect(source).toContain("autoRotate={!reducedMotion}");
    expect(source).toContain("enableDamping={!reducedMotion}");
  });
});
