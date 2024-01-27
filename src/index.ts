import type { Plugin } from "vite";
import fs from "node:fs";
import fsExtra from "fs-extra";

import { execSync, spawn } from "child_process";
import { convertCrtToPem } from "./cert-utils";

// TODO: Make this configurable
const caddyfile = `myapp.localhost {
  tls internal
  log stdout
  reverse_proxy localhost:5173
}`;

// https://caddyserver.com/docs/conventions#data-directory
// get the cert from here
export default function viteCaddySslPlugin(): Plugin {
  return {
    name: "vite:caddy-ssl",
    async configResolved(config) {
      // check if caddy cli is installed
      let caddyInstalled = false;
      try {
        execSync("caddy version");
        caddyInstalled = true;
      } catch (e) {
        caddyInstalled = false;
        console.error("caddy cli is not installed");
      }

      const cwd = process.cwd();
      // write this caddyfile to ssl directory
      console.log("Writing caddyfile to", ".ssl/Caddyfile", cwd);
      fsExtra.mkdirp(".ssl");
      fs.writeFileSync(".ssl/Caddyfile", caddyfile);

      // run caddy cli to start a local server on port
      console.log("caddyInstalled", caddyInstalled);
      const handle = spawn(`caddy run --config ".ssl/Caddyfile"`, {
        shell: true
      });

      handle.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      });

      handle.stderr.on("data", data => {
        // console.error(`stderr: ${data}`);
      });

      // ~/Library/Application Support/Caddy
      const certPath = `${process.env.HOME}/Library/Application Support/Caddy/certificates/local/myapp.localhost/myapp.localhost.crt`;
      const certKey = `${process.env.HOME}/Library/Application Support/Caddy/certificates/local/myapp.localhost/myapp.localhost.key`;

      // convertCrtToPem(certPath, `${cwd}/.ssl/cert.pem`);
      fs.writeFileSync(`${cwd}/.ssl/cert.pem`, fs.readFileSync(certPath, "utf8"), "utf8");
      fs.writeFileSync(`${cwd}/.ssl/cert.key`, fs.readFileSync(certKey, "utf8"), "utf8");

      const certificate = `${cwd}/.ssl/cert.pem`;
      const certificateKey = `${cwd}/.ssl/cert.pem`;
      const https = () => ({ cert: certificate, key: certificateKey });
      config.server.https = Object.assign({}, config.server.https, https());
      config.preview.https = Object.assign({}, config.preview.https, https());
    }
  };
}
