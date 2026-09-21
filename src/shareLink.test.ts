import { afterEach, describe, expect, it, vi } from "vitest";
import { copyShareText, currentShareUrl } from "./shareLink";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("currentShareUrl", () => {
  it("joins origin, path, search, and hash", () => {
    expect(
      currentShareUrl({
        origin: "https://jnibarger01.github.io",
        pathname: "/lexus-showroom/",
        search: "",
        hash: "#rx",
      }),
    ).toBe("https://jnibarger01.github.io/lexus-showroom/#rx");
  });

  it("preserves compare and filter hashes", () => {
    expect(
      currentShareUrl({
        origin: "https://example.test",
        pathname: "/lexus-showroom/",
        search: "?utm=1",
        hash: "#compare=es,nx",
      }),
    ).toBe("https://example.test/lexus-showroom/?utm=1#compare=es,nx");
  });
});

describe("copyShareText", () => {
  it("uses clipboard.writeText when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    await expect(
      copyShareText("https://example.test/#es", { clipboard: { writeText } }),
    ).resolves.toBe("copied");
    expect(writeText).toHaveBeenCalledWith("https://example.test/#es");
  });

  it("falls back when clipboard rejects", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    const execCommand = vi.fn().mockReturnValue(true);
    const fakeDoc = {
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
      createElement: vi.fn(() => {
        return {
          value: "",
          setAttribute: vi.fn(),
          style: {} as CSSStyleDeclaration,
          focus: vi.fn(),
          select: vi.fn(),
        };
      }),
      execCommand,
    } as unknown as Document;

    await expect(
      copyShareText("https://example.test/#filter=sedan", {
        clipboard: { writeText },
        document: fakeDoc,
      }),
    ).resolves.toBe("fallback");
    expect(execCommand).toHaveBeenCalledWith("copy");
  });

  it("returns failed when no clipboard and no document body", async () => {
    await expect(
      copyShareText("x", { clipboard: null, document: undefined }),
    ).resolves.toBe("failed");
  });
});
