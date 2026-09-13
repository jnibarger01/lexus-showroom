import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import App from "./App";

vi.mock("./components/CarShowroom3D", () => ({
  default: ({ vehicle }: { vehicle: { name: string } }) => (
    <div role="img" aria-label={`3D showroom preview for ${vehicle.name}`}>
      3D preview placeholder
    </div>
  ),
}));

afterEach(() => {
  cleanup();
});

describe("home page a11y smoke", () => {
  it("exposes landmarks, skip link, and labeled controls", () => {
    const { container } = render(<App />);

    expect(container.querySelector('a[href="#main-content"]')).toBeTruthy();
    expect(container.querySelector("main#main-content")).toBeTruthy();
    expect(container.querySelector('nav[aria-label="Primary"]')).toBeTruthy();
    expect(container.querySelector("header")).toBeTruthy();
    expect(
      container.querySelector('button[aria-label="Switch to light theme"], button[aria-label="Switch to dark theme"]'),
    ).toBeTruthy();
    expect(container.querySelector("section#contact")).toBeTruthy();
    expect(container.querySelector("footer")).toBeTruthy();
    expect(container.querySelector("table caption")).toBeTruthy();
    expect(
      container.querySelector(
        '[role="tablist"][aria-label="Choose a Lexus model"]',
      ),
    ).toBeTruthy();
  });

  it("clears serious axe findings on the home page", async () => {
    const { container } = render(<App />);
    const result = await axe.run(container, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "best-practice"] },
      rules: {
        // jsdom lacks layout/paint; contrast is covered by theme token review.
        "color-contrast": { enabled: false },
      },
    });

    const serious = result.violations.filter(
      (violation) =>
        violation.impact === "critical" || violation.impact === "serious",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});
