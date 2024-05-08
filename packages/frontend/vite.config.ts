import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      //routeFilePrefix: "-",
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    mkcert({
      //autoUpgrade: true,
      //savePath: "./cert",
      keyFileName: "key.pem",
      certFileName: "cert.pem",
    }),
    viteStaticCopy({
      watch: {
        reloadPageOnChange: true,
      },
      //structured: true,
      targets: [
        {
          src: "./staticwebapp.config.json",
          dest: "./",
          overwrite: true,
        },
        {
          src: "./.env.vault",
          dest: "./",
          overwrite: true,
        },
      ],
    }),
  ],
  define: {
    "process.env.NODE_ENV": `'${process.env.NODE_ENV}'`,
  },
  resolve: {
    alias: [
      {
        find: "@routes",
        replacement: path.resolve(__dirname, "src/routes"),
      },
      {
        find: "@utils",
        replacement: path.resolve(__dirname, "src/utils"),
      },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components"),
      },
      {
        find: "@schemas",
        replacement: path.resolve(__dirname, "src/schemas"),
      },
      {
        find: "@custom_types",
        replacement: path.resolve(__dirname, "src/custom_types"),
      },
      {
        find: "@sunrise-backend",
        replacement: path.resolve(__dirname, "../backend"),
      },
    ],
  },
  build: {
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          react_pack: ["react", "react-dom"],
          "@emotion/react": ["@emotion/react"],
          mantine_vendor: [
            "@mantine/core",
            "@mantine/carousel",
            "@mantine/dates",
            "@mantine/dropzone",
            "@mantine/hooks",
            "@mantine/modals",
            "@mantine/notifications",
            "@mantine/nprogress",
            "@mantine/spotlight",
            "@mantine/tiptap",
          ],
          tiptap_vendor: [
            "@tiptap/react",
            "@tiptap/starter-kit",
            "@tiptap/extension-highlight",
            "@tiptap/extension-link",
            "@tiptap/extension-subscript",
            "@tiptap/extension-superscript",
            "@tiptap/extension-text-align",
            "@tiptap/extension-underline",
          ],
        },
      },
    },
  },
});
