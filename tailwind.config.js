/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic tokens — values live in src/index.css and flip with html.dark
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-bright": "rgb(var(--color-accent-bright) / <alpha-value>)",
        champagne: "rgb(var(--color-champagne) / <alpha-value>)",
        graphite: "rgb(var(--color-graphite) / <alpha-value>)",
        lexus: {
          ebony: "#141210",
          cream: "#f3ede3",
          champagne: "#e4d5b8",
          graphite: "#4a453c",
          black: "#0b0b0b",
          charcoal: "#1a1a1a",
          steel: "#2c2c2e",
          silver: "#c9ccd1",
          // Brand red for fills/borders (white-on-accent passes AA)
          accent: "#8b1d2c",
          // Brighter red for small text on dark surfaces (AA ≥4.5:1)
          "accent-bright": "#e06b76",
        },
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.28em",
        kicker: "0.35em",
      },
      spacing: {
        gutter: "1.5rem",
        section: "5rem",
        "section-lg": "7rem",
      },
    },
  },
  plugins: [],
};
