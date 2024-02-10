// TODO: figure out how to avoid doing this
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { parseCaddyFile } from "./index.js";

const caddyfile = fs.readFileSync(`${__dirname}/Caddyfile`, "utf-8");
describe("caddyfile-parser", () => {
  it("should parse all hosts from the caddy file", () => {
    const hosts = parseCaddyFile(caddyfile);
    expect(hosts).toStrictEqual({
      "myapp.localhost": {
        directives: [
          { type: "tls" },
          {
            type: "proxy",
            from: "reverse_proxy",
            to: "localhost:3000",
            websocket: false
          },
          { type: "tls" },
          {
            type: "proxy",
            from: "reverse_proxy",
            to: "localhost:3000",
            websocket: false
          }
        ]
      }
    });
  });
});
