import { defineConfig } from "vite";
import caddyTls from "../src/index.js";

const config = defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    caddyTls({
      domains: ["ligam.localhost", "ok.localhost"],
    })
  ]
});

export default config;
