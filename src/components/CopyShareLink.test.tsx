import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import CopyShareLink from "./CopyShareLink";

afterEach(() => {
  cleanup();
});

describe("CopyShareLink", () => {
  it("copies the current URL and announces success", async () => {
    const copyText = vi.fn().mockResolvedValue("copied");
    render(
      <CopyShareLink
        getUrl={() => "https://jnibarger01.github.io/lexus-showroom/#rx"}
        copyText={copyText}
      />,
    );

    fireEvent.click(screen.getByTestId("copy-share-link"));

    await waitFor(() => {
      expect(screen.getByTestId("copy-share-status").textContent).toBe(
        "Link copied",
      );
    });
    expect(copyText).toHaveBeenCalledWith(
      "https://jnibarger01.github.io/lexus-showroom/#rx",
    );
  });

  it("surfaces the URL when copy fails", async () => {
    render(
      <CopyShareLink
        getUrl={() => "https://example.test/#compare=es,nx"}
        copyText={async () => "failed"}
      />,
    );

    fireEvent.click(screen.getByTestId("copy-share-link"));

    await waitFor(() => {
      expect(screen.getByTestId("copy-share-status").textContent).toContain(
        "https://example.test/#compare=es,nx",
      );
    });
  });
});
