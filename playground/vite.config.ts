import { defineConfig } from "vite";
import caddyTls from "../src/index.js";

const config = defineConfig({
  plugins: [caddyTls()],
});

export default config;
