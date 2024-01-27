import { defineConfig } from "vite";
import caddySsl from "../src/index.js";
console.log("caddySsl", caddySsl);

const config = defineConfig({
  // @ts-ignore
  plugins: [caddySsl()]
});

export default config;
