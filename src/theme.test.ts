import { afterEach, describe, expect, it } from "vitest";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  getPreferredTheme,
  toggleTheme,
} from "./theme";

afterEach(() => {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.style.colorScheme = "";
  window.localStorage.removeItem(THEME_STORAGE_KEY);
});

describe("theme", () => {
  it("prefers a stored light or dark choice over the OS", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    expect(getPreferredTheme()).toBe("light");
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(getPreferredTheme()).toBe("dark");
  });

  it("applies a class, color-scheme, and localStorage value", () => {
    applyTheme("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("toggles dark to light and back", () => {
    applyTheme("dark");
    expect(toggleTheme("dark")).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(toggleTheme("light")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
