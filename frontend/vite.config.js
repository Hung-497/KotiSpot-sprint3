import react from "@vitejs/plugin-react";
import { defineConfig, normalizePath } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { createRequire } from "node:module";

const requireSeedData = createRequire(import.meta.url);
const seedDataPath = requireSeedData.resolve("../backend/data/seedData.js");
const reviewsModuleId = "virtual:property-reviews";
const resolvedReviewsModuleId = `\0${reviewsModuleId}`;

// Expose only the sample reviews; the CommonJS seed module stays on the build side.
const seedReviews = () => ({
  name: "seed-property-reviews",
  resolveId(id) {
    if (id === reviewsModuleId) return resolvedReviewsModuleId;
  },
  load(id) {
    if (id !== resolvedReviewsModuleId) return;
    this.addWatchFile(seedDataPath);
    delete requireSeedData.cache[seedDataPath];
    const { reviews } = requireSeedData(seedDataPath);
    return `export default ${JSON.stringify(reviews)};`;
  },
  handleHotUpdate({ file, server }) {
    if (normalizePath(file) !== normalizePath(seedDataPath)) return;
    const module = server.moduleGraph.getModuleById(resolvedReviewsModuleId);
    return module ? [module] : [];
  },
});

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/KotiSpot-sprint3/" : "/",
  plugins: [react(), tailwindcss(), seedReviews()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
}));
