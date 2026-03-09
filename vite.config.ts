import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/habitflow/" : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "pwa-192.png", "pwa-512.png"],
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
      manifest: {
        name: "HabitFlow - 좋은 습관 만들기",
        short_name: "HabitFlow",
        description: "매일 좋은 습관을 만들고 추적하세요",
        theme_color: "#4a9d7c",
        background_color: "#faf8f4",
        display: "standalone",
        orientation: "portrait",
        start_url: "/habitflow/",
        scope: "/habitflow/",
        icons: [
          { src: "/habitflow/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/habitflow/pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "/habitflow/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
