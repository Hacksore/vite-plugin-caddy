import { defineConfig } from "vite";
import caddyTsl from "../src/index.js";

const config = defineConfig({
  plugins: [caddyTsl()],
});

export default config;
