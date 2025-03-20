import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/scuno-web-admin/",
  build: {
    outDir: "docs", // Set the output directory to 'docs'
  },
});
