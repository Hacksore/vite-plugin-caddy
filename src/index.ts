import type { Plugin } from "vite";
import fs from "node:fs";
import fsExtra from "fs-extra";

import { execSync, spawn } from "child_process";

// DOCS:
// https://caddyserver.com/docs/json/apps/tls/automation/
// https://caddy.community/t/how-do-i-use-rsa-instead-of-ec-certificates/7448
// https://caddy.community/t/using-caddy-to-keep-certificates-renewed/7525


// BLOCKER: we cant use the caddy cli to generate a cert with SANs
// https://github.com/caddyserver/caddy/issues/6070

const caddyJsonTest = `{
	"apps": {
		"tls": {
			"certificates": {
				"automate": [
					"myapp.localhost",
          "localhost",
          "127.0.0.0"
				]
			},
			"automation": {
				"policies": [
					{
			      "key_type": "rsa4096",
						"issuers": [{"module": "internal"}]
					}
				]
			}
		}
	}
}`;

const cwd = process.cwd();
const CADDY_CONFIG_DIR = `${cwd}/.ssl`;

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
}

// https://caddyserver.com/docs/conventions#data-directory
// get the cert from here
export default function viteCaddySslPlugin(): Plugin {
  return {
    name: "vite:caddy-ssl",
    async configResolved({ command, server, preview }) {
      if (command !== "serve") return;
      // make sure caddy is installed
      validateCaddyIsInstalled();

      console.log("Caddy dir", CADDY_CONFIG_DIR);

      fsExtra.mkdirp(CADDY_CONFIG_DIR);

      console.log("writting caddy file");
      // create caddy json config file
      fs.writeFileSync(
        `${CADDY_CONFIG_DIR}/config.json`,
        caddyJsonTest,
        "utf8"
      );

      console.log("wrote caddy file");

      // run caddy cli to start a local server on port
      const handle = spawn(
        `caddy run --config "${CADDY_CONFIG_DIR}/config.json"`,
        {
          shell: true
        }
      );

      handle.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      });

      handle.stderr.on("data", data => {
        console.error(`stderr: ${data}`);
      });

      const caddyCertPath = `${process.env.HOME}/Library/Application Support/Caddy/certificates/local/myapp.localhost/myapp.localhost.crt`;
      const caddyCertKeyPath = `${process.env.HOME}/Library/Application Support/Caddy/certificates/local/myapp.localhost/myapp.localhost.key`;

      fs.writeFileSync(
        `${CADDY_CONFIG_DIR}/cert.pem`,
        fs.readFileSync(caddyCertPath, "utf8"),
        "utf8"
      );

      fs.writeFileSync(
        `${CADDY_CONFIG_DIR}/cert.key`,
        fs.readFileSync(caddyCertKeyPath, "utf8"),
        "utf8"
      );

      const certificatePath = `${CADDY_CONFIG_DIR}/cert.pem`;
      const certificateKeyPath = `${CADDY_CONFIG_DIR}/cert.key`;
      const https = () => ({ cert: certificatePath, key: certificateKeyPath });
      server.https = Object.assign({}, server.https, https());
      preview.https = Object.assign({}, preview.https, https());
    }
  };
}
