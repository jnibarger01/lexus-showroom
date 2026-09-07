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
          accent: "#8b1d2c",
        },
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
