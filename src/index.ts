import type { Plugin } from "vite";
import picocolors from "picocolors";
import { spawn } from "child_process";
import { parseNamesFromCaddyFile, validateCaddyIsInstalled } from "./utils";

const cwd = process.cwd();

export default function viteCaddyTlsPlugin(): Plugin {
  return {
    name: "vite:caddy-tls",
    async configResolved({ command }) {
      if (command !== "serve") return;

      validateCaddyIsInstalled();

      // run caddy cli to start the server
      const handle = spawn(`caddy run --config "${cwd}/Caddyfile"`, {
        shell: true
      });

      handle.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      });

      handle.stderr.on("data", () => {
        // TODO: handle error
      });

      const servers = parseNamesFromCaddyFile(`${cwd}/Caddyfile`);
      console.log();
      console.log(
        picocolors.green("🔒 Caddy is running to proxy your traffic on https")
      );

      console.log(
        `🔗 Access your local ${servers.length > 1 ? "servers" : "server"} `
      );

      // we need to parse the Caddyfile
      servers.forEach(domain => {
        console.log(picocolors.blue(`🌍 https://${domain}`));
      });

      console.log();
    }
  };
}
