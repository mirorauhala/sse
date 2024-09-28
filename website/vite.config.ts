import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
  plugins: [TanStackRouterVite(), viteReact()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },

  server: {
    host: "localhost",
    port: 3000,
    proxy: { "/api": "http://127.0.0.1:3030" },
  },
  preview: {
    host: "localhost",
    port: 3000,
    proxy: { "/api": "http://127.0.0.1:3030" },
  },
});
