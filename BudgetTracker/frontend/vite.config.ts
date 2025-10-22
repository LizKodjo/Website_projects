import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // VitePWA({
    //   registerType: "autoUpdate",
    //   workbox: {
    //     globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    //   },
    //   manifest: {
    //     name: "BudgetTracker - Personal Finance Manager",
    //     short_name: "BudgetTracker",
    //     description:
    //       "Take control of your finances with modern budget tracking",
    //     theme_color: "#3b82f6",
    //     icons: [
    //       {
    //         src: "icons/icon-192x192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "icons/icon-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //     ],
    //   },
    //   devOptions: {
    //     enabled: true, // Enable PWA in development
    //   },
    // }),
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
  },
});
