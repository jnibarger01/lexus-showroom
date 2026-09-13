import { useEffect, useState } from "react";
import { applyTheme, getPreferredTheme, toggleTheme, type Theme } from "../theme";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Models", href: "#models" },
  { label: "Specs", href: "#specs" },
  { label: "Compare", href: "#compare" },
  { label: "Contact", href: "#contact" },
];

const focusRing =
  "rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center text-ink ${focusRing}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      onClick={() => setTheme(toggleTheme(theme))}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 4.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 4.5Zm0 12.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75Zm7.5-6.75a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM6.75 12a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1 0-1.5H6a.75.75 0 0 1 .75.75Zm10.07 5.3a.75.75 0 0 1-1.06 0l-1.06-1.06a.75.75 0 1 1 1.06-1.06l1.06 1.06a.75.75 0 0 1 0 1.06Zm-8.49-8.48a.75.75 0 0 1-1.06 0L6.21 7.76A.75.75 0 0 1 7.27 6.7l1.06 1.06a.75.75 0 0 1 0 1.06Zm8.49 0a.75.75 0 0 1 0-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06 0ZM7.27 17.3a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 1 1 1.06 1.06L7.27 17.3ZM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21 14.3A8.5 8.5 0 0 1 9.7 3a.75.75 0 0 0-.95-.95 10 10 0 1 0 12.2 12.2.75.75 0 0 0-.95-.95Z"
          />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Collapse mobile menu when viewport reaches md breakpoint
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setIsMenuOpen(false);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Escape closes the mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  // Prevent background scroll while the mobile drawer is open
  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/10 bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-gutter">
        <a
          href="#home"
          className={`min-w-0 text-lg font-bold tracking-brand text-ink sm:text-xl sm:tracking-[0.3em] ${focusRing}`}
          onClick={() => setIsMenuOpen(false)}
        >
          LEXUS
        </a>

        <nav aria-label="Primary" className="hidden gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`py-1 text-sm font-medium uppercase tracking-wide text-muted transition-colors hover:text-ink ${focusRing}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className={`relative flex min-h-11 min-w-11 shrink-0 items-center justify-center md:hidden ${focusRing}`}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
            <span className="relative block h-4 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 bg-ink transition-transform ${
                  isMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-6 bg-ink transition-opacity ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-6 bg-ink transition-transform ${
                  isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          className="flex max-h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto border-t border-line/10 px-4 py-4 sm:px-gutter md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-2 py-3 text-sm font-medium uppercase tracking-wide text-muted hover:bg-ink/5 hover:text-ink ${focusRing}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
