import { describe, expect, it, vi } from "vitest";
import {
  prefetchSiblingStills,
  shouldPrefetchStills,
  siblingStillUrls,
} from "./prefetchSiblingStills";

const vehicles = [
  {
    id: "es",
    stillSrc: "/stills/es.svg",
    stillSrcSet: "/stills/es.svg 1x, /stills/es@2x.svg 2x",
  },
  {
    id: "nx",
    stillSrc: "/stills/nx.svg",
    stillSrcSet: "/stills/nx.svg 1x, /stills/nx@2x.svg 2x",
  },
  {
    id: "rx",
    stillSrc: "/stills/rx.svg",
    stillSrcSet: "/stills/rx.svg 1x, /stills/rx@2x.svg 2x",
  },
];

describe("prefetchSiblingStills", () => {
  it("lists sibling 1x/2x URLs and skips the selected vehicle", () => {
    expect(siblingStillUrls(vehicles, "rx").sort()).toEqual(
      [
        "/stills/es.svg",
        "/stills/es@2x.svg",
        "/stills/nx.svg",
        "/stills/nx@2x.svg",
      ].sort(),
    );
  });

  it("skips prefetch on Save-Data or 2g", () => {
    expect(shouldPrefetchStills({ saveData: true })).toBe(false);
    expect(shouldPrefetchStills({ effectiveType: "2g" })).toBe(false);
    expect(shouldPrefetchStills({ effectiveType: "4g" })).toBe(true);
  });

  it("schedules Image() loads for siblings when allowed", () => {
    const assigned: string[] = [];
    class FakeImage {
      set src(value: string) {
        assigned.push(value);
      }
    }
    const urls = prefetchSiblingStills(vehicles, "es", {
      connection: { effectiveType: "4g" },
      ImageCtor: FakeImage,
      schedule: (cb) => cb(),
    });
    expect(urls).toContain("/stills/nx.svg");
    expect(assigned.sort()).toEqual(urls.sort());
  });

  it("returns no URLs when Save-Data is on", () => {
    const ImageCtor = vi.fn();
    expect(
      prefetchSiblingStills(vehicles, "es", {
        connection: { saveData: true },
        ImageCtor: ImageCtor as never,
        schedule: (cb) => cb(),
      }),
    ).toEqual([]);
    expect(ImageCtor).not.toHaveBeenCalled();
  });
});
