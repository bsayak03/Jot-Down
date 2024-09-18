import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias '@' points to 'src'
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_REACT_APP_BACKEND_BASEURL, // Fallback if the env var is missing
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
