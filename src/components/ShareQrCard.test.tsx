import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ShareQrCard from "./ShareQrCard";

afterEach(() => {
  cleanup();
});

describe("ShareQrCard", () => {
  it("stays closed until toggled, then shows QR for the share URL", () => {
    const url = "https://jnibarger01.github.io/lexus-showroom/#nx";
    render(<ShareQrCard getUrl={() => url} />);

    expect(screen.queryByTestId("share-qr-panel")).toBeNull();
    fireEvent.click(screen.getByTestId("share-qr-toggle"));
    expect(screen.getByTestId("share-qr-panel")).toBeTruthy();
    expect(screen.getByTestId("share-qr-svg").getAttribute("aria-label")).toBe(
      `QR code for ${url}`,
    );
    expect(screen.getByTestId("share-qr-svg").innerHTML).toMatch(/<svg/);
  });
});
