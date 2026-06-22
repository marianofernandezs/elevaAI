import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  envPrefix: ["VITE_", "OPENROUTER_", "SENTRY_", "OPENAI_", "ANTHROPIC_", "GEMINI_"],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          pdfjs: ["pdfjs-dist"],
          ui: ["lucide-react"],
          sentry: ["@sentry/react"]
        }
      }
    }
  }
});
