import { defineConfig } from "vite";

const base = process.env.KITESQL_WEB_BASE ?? "/";

export default defineConfig({
  base,
  publicDir: "static",
  server: {
    port: 4173,
  },
  preview: {
    port: 4173,
  },
});
