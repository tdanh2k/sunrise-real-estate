import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    mkcert({
      autoUpgrade: true,
      savePath: "./cert",
      keyFileName: "key.pem",
      certFileName: "cert.pem",
    }),
  ],
  resolve: {
    alias: [
      { find: "@client", replacement: path.resolve(__dirname, "src/client") },
      { find: "@manage", replacement: path.resolve(__dirname, "src/manage") },
      {
        find: "@routes",
        replacement: path.resolve(__dirname, "src/routes"),
      },
      {
        find: "@utils",
        replacement: path.resolve(__dirname, "src/utils"),
      },
    ],
  },
});
