import { describe, expect, it } from "vitest";
import { formatUsd, resolveDisplayLocale } from "./formatUsd";

describe("formatUsd", () => {
  it("defaults to en-US", () => {
    expect(resolveDisplayLocale(undefined)).toBe("en-US");
    expect(formatUsd(48895, "en-US")).toBe("$48,895");
  });

  it("uses German grouping for the same USD amount", () => {
    const formatted = formatUsd(48895, "de-DE");
    // Intl may render "48.895 $" or "48.895 US$" depending on ICU data.
    expect(formatted.replace(/\s/g, " ")).toMatch(/48\.895/);
    expect(formatted).toMatch(/\$|USD/);
  });
});
