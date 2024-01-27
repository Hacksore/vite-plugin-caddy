import { defineConfig } from "vite";
import caddySsl from "../src/index.js";

const config = defineConfig({
  plugins: [caddySsl()],
});

export default config;
