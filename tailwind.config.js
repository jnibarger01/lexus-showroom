/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lexus: {
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
      },
    },
  },
  plugins: [],
};
