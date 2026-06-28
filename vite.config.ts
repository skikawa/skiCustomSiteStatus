import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devServer from "@hono/vite-dev-server";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    devServer({
      entry: "src/server.ts",
      exclude: [
        /^\/(?!api\/)/, // Exclude everything that is NOT /api/* from being handled by Hono
      ],
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8566,
  },
});
