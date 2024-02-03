import { defineConfig } from "vite";
import caddyTls from "../src/index.js";

const config = defineConfig({
  plugins: [
    caddyTls({
      domains: ["ligam.localhost", "ok.localhost"],
    })
  ]
});

export default config;
