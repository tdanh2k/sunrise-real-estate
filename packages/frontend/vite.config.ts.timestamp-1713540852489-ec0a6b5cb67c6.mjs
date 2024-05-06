// vite.config.ts
import { defineConfig } from "file:///D:/IUH/HKIV/Graduate/sunrise-real-estate/node_modules/.pnpm/vite@5.2.9_@types+node@20.12.7_sugarss@4.0.1_postcss@8.4.38_/node_modules/vite/dist/node/index.js";
import react from "file:///D:/IUH/HKIV/Graduate/sunrise-real-estate/node_modules/.pnpm/@vitejs+plugin-react-swc@3.6.0_vite@5.2.9_@types+node@20.12.7_sugarss@4.0.1_postcss@8.4.38__/node_modules/@vitejs/plugin-react-swc/index.mjs";
import mkcert from "file:///D:/IUH/HKIV/Graduate/sunrise-real-estate/node_modules/.pnpm/vite-plugin-mkcert@1.17.5_vite@5.2.9_@types+node@20.12.7_sugarss@4.0.1_postcss@8.4.38__/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import path from "path";
import { TanStackRouterVite } from "file:///D:/IUH/HKIV/Graduate/sunrise-real-estate/node_modules/.pnpm/@tanstack+router-vite-plugin@1.28.2_vite@5.2.9_@types+node@20.12.7_sugarss@4.0.1_postcss@8.4.38__/node_modules/@tanstack/router-vite-plugin/dist/esm/index.js";
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
      //autoUpgrade: true,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxJVUhcXFxcSEtJVlxcXFxHcmFkdWF0ZVxcXFxzdW5yaXNlLXJlYWwtZXN0YXRlXFxcXHBhY2thZ2VzXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxJVUhcXFxcSEtJVlxcXFxHcmFkdWF0ZVxcXFxzdW5yaXNlLXJlYWwtZXN0YXRlXFxcXHBhY2thZ2VzXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9JVUgvSEtJVi9HcmFkdWF0ZS9zdW5yaXNlLXJlYWwtZXN0YXRlL3BhY2thZ2VzL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IG1rY2VydCBmcm9tIFwidml0ZS1wbHVnaW4tbWtjZXJ0XCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IFRhblN0YWNrUm91dGVyVml0ZSB9IGZyb20gXCJAdGFuc3RhY2svcm91dGVyLXZpdGUtcGx1Z2luXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBUYW5TdGFja1JvdXRlclZpdGUoe1xyXG4gICAgICAvL3JvdXRlRmlsZVByZWZpeDogXCItXCIsXHJcbiAgICAgIHJvdXRlc0RpcmVjdG9yeTogXCIuL3NyYy9yb3V0ZXNcIixcclxuICAgICAgZ2VuZXJhdGVkUm91dGVUcmVlOiBcIi4vc3JjL3JvdXRlVHJlZS5nZW4udHNcIixcclxuICAgIH0pLFxyXG4gICAgbWtjZXJ0KHtcclxuICAgICAgLy9hdXRvVXBncmFkZTogdHJ1ZSxcclxuICAgICAgLy9zYXZlUGF0aDogXCIuL2NlcnRcIixcclxuICAgICAga2V5RmlsZU5hbWU6IFwia2V5LnBlbVwiLFxyXG4gICAgICBjZXJ0RmlsZU5hbWU6IFwiY2VydC5wZW1cIixcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IFwiQHJvdXRlc1wiLFxyXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9yb3V0ZXNcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiBcIkB1dGlsc1wiLFxyXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy91dGlsc1wiKSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IFwiQGNvbXBvbmVudHNcIixcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvY29tcG9uZW50c1wiKSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IFwiQHNjaGVtYXNcIixcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvc2NoZW1hc1wiKSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IFwiQGN1c3RvbV90eXBlc1wiLFxyXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9jdXN0b21fdHlwZXNcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiBcIkBzdW5yaXNlLWJhY2tlbmRcIixcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9iYWNrZW5kXCIpLFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VyxTQUFTLG9CQUFvQjtBQUMzWSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sVUFBVTtBQUNqQixTQUFTLDBCQUEwQjtBQUpuQyxJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixtQkFBbUI7QUFBQTtBQUFBLE1BRWpCLGlCQUFpQjtBQUFBLE1BQ2pCLG9CQUFvQjtBQUFBLElBQ3RCLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQTtBQUFBO0FBQUEsTUFHTCxhQUFhO0FBQUEsTUFDYixjQUFjO0FBQUEsSUFDaEIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsTUFDbkQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssUUFBUSxrQ0FBVyxXQUFXO0FBQUEsTUFDbEQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssUUFBUSxrQ0FBVyxnQkFBZ0I7QUFBQSxNQUN2RDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUNwRDtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLE1BQ3pEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQ25EO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
