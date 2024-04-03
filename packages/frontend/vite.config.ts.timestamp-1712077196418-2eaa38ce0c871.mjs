// vite.config.ts
import { defineConfig } from "file:///D:/IUH/HKIV/Graduate/sunrise-real-estate/node_modules/.pnpm/vite@5.2.7_@types+node@20.12.2/node_modules/vite/dist/node/index.js";
import react from "file:///D:/IUH/HKIV/Graduate/sunrise-real-estate/node_modules/.pnpm/@vitejs+plugin-react-swc@3.6.0_vite@5.2.7/node_modules/@vitejs/plugin-react-swc/index.mjs";
import mkcert from "file:///D:/IUH/HKIV/Graduate/sunrise-real-estate/node_modules/.pnpm/vite-plugin-mkcert@1.17.5_vite@5.2.7/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import path from "path";
import { TanStackRouterVite } from "file:///D:/IUH/HKIV/Graduate/sunrise-real-estate/node_modules/.pnpm/@tanstack+router-vite-plugin@1.25.0_vite@5.2.7/node_modules/@tanstack/router-vite-plugin/dist/esm/index.js";
var __vite_injected_original_dirname = "D:\\IUH\\HKIV\\Graduate\\sunrise-real-estate\\packages\\frontend";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      //routeFilePrefix: "-",
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts"
    }),
    mkcert({
      autoUpgrade: true,
      //savePath: "./cert",
      keyFileName: "key.pem",
      certFileName: "cert.pem"
    })
  ],
  resolve: {
    alias: [
      {
        find: "@routes",
        replacement: path.resolve(__vite_injected_original_dirname, "src/routes")
      },
      {
        find: "@utils",
        replacement: path.resolve(__vite_injected_original_dirname, "src/utils")
      },
      {
        find: "@components",
        replacement: path.resolve(__vite_injected_original_dirname, "src/components")
      },
      {
        find: "@schemas",
        replacement: path.resolve(__vite_injected_original_dirname, "src/schemas")
      },
      {
        find: "@custom_types",
        replacement: path.resolve(__vite_injected_original_dirname, "src/custom_types")
      },
      {
        find: "@sunrise-backend",
        replacement: path.resolve(__vite_injected_original_dirname, "../backend")
      }
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxJVUhcXFxcSEtJVlxcXFxHcmFkdWF0ZVxcXFxzdW5yaXNlLXJlYWwtZXN0YXRlXFxcXHBhY2thZ2VzXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxJVUhcXFxcSEtJVlxcXFxHcmFkdWF0ZVxcXFxzdW5yaXNlLXJlYWwtZXN0YXRlXFxcXHBhY2thZ2VzXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9JVUgvSEtJVi9HcmFkdWF0ZS9zdW5yaXNlLXJlYWwtZXN0YXRlL3BhY2thZ2VzL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IG1rY2VydCBmcm9tIFwidml0ZS1wbHVnaW4tbWtjZXJ0XCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IFRhblN0YWNrUm91dGVyVml0ZSB9IGZyb20gXCJAdGFuc3RhY2svcm91dGVyLXZpdGUtcGx1Z2luXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBUYW5TdGFja1JvdXRlclZpdGUoe1xyXG4gICAgICAvL3JvdXRlRmlsZVByZWZpeDogXCItXCIsXHJcbiAgICAgIHJvdXRlc0RpcmVjdG9yeTogXCIuL3NyYy9yb3V0ZXNcIixcclxuICAgICAgZ2VuZXJhdGVkUm91dGVUcmVlOiBcIi4vc3JjL3JvdXRlVHJlZS5nZW4udHNcIixcclxuICAgIH0pLFxyXG4gICAgbWtjZXJ0KHtcclxuICAgICAgYXV0b1VwZ3JhZGU6IHRydWUsXHJcbiAgICAgIC8vc2F2ZVBhdGg6IFwiLi9jZXJ0XCIsXHJcbiAgICAgIGtleUZpbGVOYW1lOiBcImtleS5wZW1cIixcclxuICAgICAgY2VydEZpbGVOYW1lOiBcImNlcnQucGVtXCIsXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiBcIkByb3V0ZXNcIixcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvcm91dGVzXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZmluZDogXCJAdXRpbHNcIixcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvdXRpbHNcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiBcIkBjb21wb25lbnRzXCIsXHJcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2NvbXBvbmVudHNcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiBcIkBzY2hlbWFzXCIsXHJcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3NjaGVtYXNcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiBcIkBjdXN0b21fdHlwZXNcIixcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvY3VzdG9tX3R5cGVzXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZmluZDogXCJAc3VucmlzZS1iYWNrZW5kXCIsXHJcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vYmFja2VuZFwiKSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFcsU0FBUyxvQkFBb0I7QUFDM1ksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFVBQVU7QUFDakIsU0FBUywwQkFBMEI7QUFKbkMsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sbUJBQW1CO0FBQUE7QUFBQSxNQUVqQixpQkFBaUI7QUFBQSxNQUNqQixvQkFBb0I7QUFBQSxJQUN0QixDQUFDO0FBQUEsSUFDRCxPQUFPO0FBQUEsTUFDTCxhQUFhO0FBQUE7QUFBQSxNQUViLGFBQWE7QUFBQSxNQUNiLGNBQWM7QUFBQSxJQUNoQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxRQUFRLGtDQUFXLFlBQVk7QUFBQSxNQUNuRDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxRQUFRLGtDQUFXLFdBQVc7QUFBQSxNQUNsRDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLE1BQ3ZEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLE1BQ3BEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsTUFDekQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsTUFDbkQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
