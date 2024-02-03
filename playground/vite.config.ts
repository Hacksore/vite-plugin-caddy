import { defineConfig } from "vite";
import caddyTls from "../src/index.js";

const config = defineConfig({
  plugins: [
    caddyTls({
      domains: ["ok.localhost", "testing.localhost"],
      // * as string or an array of hostnames ["domain1.example", "domain2.example"]
      cors: "*",
      // other properties that we want to support
    })
  ]
});

export default config;
