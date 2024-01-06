import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteRewriteAll from "vite-plugin-rewrite-all";
import svgrPlugin from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8081,
  },
  optimizeDeps: {
    exclude: ["dist"],
  },
  build: {
    rollupOptions: {
      treeshake: false,
    },
  },
  resolve: {
    alias: {
      "devextreme/ui": "devextreme/esm/ui",
    },
  },
  plugins: [
    viteRewriteAll(),
    react({
      jsxRuntime: "classic",
    }),
    viteTsconfigPaths(),
    svgrPlugin(),
  ],
});
