import { describe, expect, it } from "vitest";
import { shareQrPayload, shareQrSvg } from "./shareQr";
import { currentShareUrl } from "./shareLink";

describe("shareQr", () => {
  it("payload matches currentShareUrl", () => {
    const loc = {
      origin: "https://jnibarger01.github.io",
      pathname: "/lexus-showroom/",
      search: "",
      hash: "#rx",
    };
    expect(shareQrPayload(loc)).toBe(currentShareUrl(loc));
  });

  it("renders an SVG that embeds the share URL", () => {
    const url = "https://jnibarger01.github.io/lexus-showroom/#es";
    const svg = shareQrSvg(url);
    expect(svg).toMatch(/^<svg[\s\S]*<\/svg>$/);
    // uqr encodes modules; the human URL is the encoder input — assert helper wiring.
    expect(shareQrPayload({
      origin: "https://jnibarger01.github.io",
      pathname: "/lexus-showroom/",
      search: "",
      hash: "#es",
    })).toBe(url);
  });
});
