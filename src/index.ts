import type { Plugin } from "vite";
import chalk from "chalk";
import { spawn } from "node:child_process";
import {
  generateCaddyConfig,
  validateCaddyIsInstalled,
  writeTempFile
} from "./utils";

export default function viteCaddyTlsPlugin({
  domains,
  cors
}: {
  domains: string | string[];
  cors?: string;
}): Plugin {
  return {
    name: "vite:caddy-tls",
    async configureServer({ httpServer, config }) {
      validateCaddyIsInstalled();

      const { port } = config.server;
      const rawDomainArray = Array.isArray(domains) ? domains : [domains];
      const domainArray = Array.from(new Set(rawDomainArray));
      const generatedConfig = generateCaddyConfig(domainArray, port, cors);

      const caddyConfig = writeTempFile(
        JSON.stringify(generatedConfig, null, 2)
      );

      // run caddy cli to start the server
      const caddyCommand = `caddy run --config ${caddyConfig.fullPath}`;
      const handle = spawn(caddyCommand, {
        shell: true
      });

      const { pid } = handle;

      handle.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      });

      handle.stderr.on("data", () => {
        // TODO: handle error
      });

      console.log();
      console.log(
        chalk.green("🔒 Caddy is running to proxy your traffic on https")
      );

      console.log();
      console.log(
        `🔗 Access your local ${domainArray.length > 1 ? "servers" : "server"} `
      );

      // we need to parse the Caddyfile
      domainArray.forEach(domain => {
        console.log(chalk.blue(`🌍 https://${domain}`));
      });

      console.log();

      // if we stop the server kill the caddy process
      httpServer?.on("close", () => {
        console.log("Killing Caddy process");
        if (!pid) return;
        try {
          process.kill(pid);
        } catch (e) {
          console.error("Caddy process not found");
        }
      });
    }
  };
}
