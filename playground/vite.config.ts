import { defineConfig } from "vite";
import caddyTls from "../packages/plugin/src/index.js";

const config = defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    caddyTls({
      domains: ["this.is.cool.localhost", "something-else.localhost"],
    })
  ]
});

export default config;
