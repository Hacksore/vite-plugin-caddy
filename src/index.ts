import type { Plugin } from "vite";
import fs from "node:fs";
import { execSync, spawn } from "child_process";
import { parseNamesFromCaddyFile } from "./utils";

const cwd = process.cwd();

function validateCaddyIsInstalled() {
  // check if caddy cli is installed
  let caddyInstalled = false;
  try {
    execSync("caddy version");
    caddyInstalled = true;
  } catch (e) {
    caddyInstalled = false;
    console.error("caddy cli is not installed");
  }

  return caddyInstalled;
}

// https://caddyserver.com/docs/conventions#data-directory
// get the cert from here
export default function viteCaddySslPlugin(): Plugin {
  return {
    name: "vite:caddy-ssl",
    async configResolved({ command, server }) {
      if (command !== "serve") return;

      validateCaddyIsInstalled();

      // run caddy cli to start a local server on port
      const handle = spawn(`caddy run --config "${cwd}/Caddyfile"`, {
        shell: true
      });

      handle.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      });

      handle.stderr.on("data", data => {
        // console.error(`stderr: ${data}`);
      });

      console.log();
      console.log("🔥 Caddy server is running and the following domains are available:");

      // we need to parse the Caddyfile
      parseNamesFromCaddyFile(`${cwd}/Caddyfile`).forEach(domain => {
        console.log(`https://${domain}`);
      });

      console.log();
    }
  };
}
