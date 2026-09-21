import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Project page (jnibarger01.github.io/lexus-showroom), so base must match the repo name.
export default defineConfig({
  plugins: [react()],
  base: "/lexus-showroom/",
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        // Without an origin, jsdom leaves window.localStorage undefined.
        url: "http://localhost/",
      },
    },
    setupFiles: ["./src/test/setup.ts"],
    globals: false,
    css: false,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
