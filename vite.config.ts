import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// WICHTIG: Repo-Name für GitHub Pages eintragen
// Wenn dein Repo anders heißt, hier anpassen:
const basePath = "/David-Unternehmerspiel/";

export default defineConfig({
  base: basePath,        // nötig für GitHub Pages
  plugins: [react()],
});
