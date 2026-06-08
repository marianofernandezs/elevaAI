import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  envPrefix: ["VITE_", "OPENROUTER_", "SENTRY_", "OPENAI_", "ANTHROPIC_", "GEMINI_"],
});
