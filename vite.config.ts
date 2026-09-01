import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const providerTarget = process.env.MINILAB_PROVIDER_URL
  ?? `http://127.0.0.1:${process.env.MINILAB_PROVIDER_PORT ?? process.env.CARBON_CONTROL_PLANE_PORT ?? 8788}`;

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT ?? 5173),
    // One platform seam. Development may point it at any backend/adapter that
    // satisfies the Minilab /api contract. Provider internals stay outside UI.
    proxy: {
      "/api": {
        target: providerTarget,
        changeOrigin: false,
      },
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
    allowedHosts: ["control.minilab.work"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@manifests": path.resolve(__dirname, "combined.minilab-ui-spec.json"),
    },
  },
});
