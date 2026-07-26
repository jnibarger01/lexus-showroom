import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Project page (jnibarger01.github.io/lexus-showroom), so base must match the repo name.
export default defineConfig({
  plugins: [react()],
  base: "/lexus-showroom/",
});
