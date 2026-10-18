/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        // Gemeinsame Teile in eigene Dateien: sonst importieren die ArcGIS-Dateien die App-Datei
        // und bekommen bei jeder App-Änderung neue Namen (große Diffs in docs/, kaputte Caches).
        manualChunks(id) {
          if (id.includes("vite/preload-helper") || id.includes("commonjsHelpers")) return "runtime";
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return "react";
        }
      }
    }
  },
  test: { environment: "jsdom", css: false }
});
