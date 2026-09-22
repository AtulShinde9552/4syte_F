import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    allowedHosts: [".ngrok-free.dev"],
    proxy: {
      "/clientportal": {
        target: "https://api.4syte.io/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/clientportal/, ""),
      },
    },
  },
});