export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "lexus-showroom-theme";

export function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // private mode / quota
  }

  if (typeof window.matchMedia === "function") {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }

  // Brand-default when the OS preference is unknown
  return "dark";
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // private mode / quota
  }
}

export function toggleTheme(current: Theme): Theme {
  const next: Theme = current === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
