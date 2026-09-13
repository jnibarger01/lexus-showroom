import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { GITHUB_REPO_URL, SITE_LAST_UPDATED } from "../siteMeta";

afterEach(() => {
  cleanup();
});

describe("Footer", () => {
  it("shows disclaimer, last-updated stamp, and GitHub link", () => {
    render(<Footer />);

    const disclaimer = screen.getByTestId("footer-disclaimer");
    expect(disclaimer.textContent).toMatch(/unofficial demo/i);
    expect(disclaimer.textContent).toMatch(/not affiliated/i);
    expect(disclaimer.textContent).toMatch(/illustrative/i);

    const stamp = screen.getByText(SITE_LAST_UPDATED);
    expect(stamp.tagName).toBe("TIME");
    expect(stamp.getAttribute("dateTime")).toBe(SITE_LAST_UPDATED);

    const link = screen.getByRole("link", { name: /view source on github/i });
    expect(link.getAttribute("href")).toBe(GITHUB_REPO_URL);
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel") ?? "").toMatch(/noopener/);
  });
});
