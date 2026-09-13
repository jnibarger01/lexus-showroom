import { describe, expect, it } from "vitest";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  applyPageMeta,
  buildPageMeta,
  joinAbsoluteUrl,
  vehicleIdFromLocation,
} from "./seo";

const ORIGIN = "https://jnibarger01.github.io";
const BASE = "/lexus-showroom/";
const lineup = [
  { id: "es", name: "Lexus ES", tagline: "All-electric refinement in the eighth-generation ES." },
  { id: "rx", name: "Lexus RX", tagline: "The original luxury SUV, tuned for every drive." },
] as const;

describe("joinAbsoluteUrl", () => {
  it("includes the Pages base path and avoids double slashes", () => {
    expect(joinAbsoluteUrl(ORIGIN + "/", BASE, "")).toBe(
      "https://jnibarger01.github.io/lexus-showroom/",
    );
    expect(joinAbsoluteUrl(ORIGIN, "lexus-showroom", "rx")).toBe(
      "https://jnibarger01.github.io/lexus-showroom/#rx",
    );
  });
});

describe("vehicleIdFromLocation", () => {
  const ids = ["es", "nx", "rx", "lx"];

  it("reads a vehicle hash route", () => {
    expect(
      vehicleIdFromLocation({ hash: "#rx", pathname: "/lexus-showroom/" }, ids),
    ).toBe("rx");
  });

  it("reads a trailing path segment deep link", () => {
    expect(
      vehicleIdFromLocation({ hash: "", pathname: "/lexus-showroom/nx/" }, ids),
    ).toBe("nx");
  });

  it("ignores section hashes and unknown ids", () => {
    expect(
      vehicleIdFromLocation({ hash: "#models", pathname: "/lexus-showroom/" }, ids),
    ).toBeUndefined();
    expect(
      vehicleIdFromLocation({ hash: "#home", pathname: "/lexus-showroom/" }, ids),
    ).toBeUndefined();
  });
});

describe("buildPageMeta", () => {
  it("uses home defaults and an absolute Pages URL", () => {
    const meta = buildPageMeta({
      origin: ORIGIN,
      basePath: BASE,
      vehicles: lineup,
    });
    expect(meta.title).toBe(HOME_TITLE);
    expect(meta.description).toBe(HOME_DESCRIPTION);
    expect(meta.url).toBe("https://jnibarger01.github.io/lexus-showroom/");
    expect(meta.image).toBeUndefined();
  });

  it("builds per-vehicle title, tagline, and hash URL", () => {
    const meta = buildPageMeta({
      vehicleId: "rx",
      origin: ORIGIN,
      basePath: BASE,
      vehicles: lineup,
    });
    expect(meta.title).toBe("Lexus RX | Lexus Showroom");
    expect(meta.description).toBe("The original luxury SUV, tuned for every drive.");
    expect(meta.url).toBe("https://jnibarger01.github.io/lexus-showroom/#rx");
  });

  it("falls back to home meta for an unknown vehicle id", () => {
    const meta = buildPageMeta({
      vehicleId: "gx",
      origin: ORIGIN,
      basePath: BASE,
      vehicles: lineup,
    });
    expect(meta.title).toBe(HOME_TITLE);
    expect(meta.url).toBe("https://jnibarger01.github.io/lexus-showroom/");
  });

  it("resolves an optional OG image under the Pages base path", () => {
    const meta = buildPageMeta({
      origin: ORIGIN,
      basePath: BASE,
      imagePath: "og.png",
      vehicles: lineup,
    });
    expect(meta.image).toBe("https://jnibarger01.github.io/lexus-showroom/og.png");
  });
});

describe("applyPageMeta", () => {
  it("writes title, description, OG, and canonical tags", () => {
    const meta = buildPageMeta({
      vehicleId: "es",
      origin: ORIGIN,
      basePath: BASE,
      vehicles: lineup,
    });
    applyPageMeta(meta, document);

    expect(document.title).toBe("Lexus ES | Lexus Showroom");
    expect(
      document.head.querySelector('meta[name="description"]')?.getAttribute("content"),
    ).toBe(lineup[0].tagline);
    expect(
      document.head.querySelector('meta[property="og:title"]')?.getAttribute("content"),
    ).toBe("Lexus ES | Lexus Showroom");
    expect(
      document.head.querySelector('meta[property="og:url"]')?.getAttribute("content"),
    ).toBe("https://jnibarger01.github.io/lexus-showroom/#es");
    expect(
      document.head.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://jnibarger01.github.io/lexus-showroom/#es");
  });
});
