import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/personal_web_codex/",
  build: {
    outDir: "docs",
  },
  plugins: [react()],
});
