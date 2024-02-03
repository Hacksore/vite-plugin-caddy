import { execSync } from "child_process";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";

/**
 * This function checks if caddy cli is installed
 *
 * @returns {boolean} if the caddy cli is installed
 */
export function validateCaddyIsInstalled() {
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

// make a function that will write to the temp dir on all platforms
// and then return the path to the file
export function writeTempFile(content: string) {
  const tempDir = os.tmpdir();

  const filename = `caddy-${Date.now()}.json`;
  const filePath = path.join(tempDir, filename);

  fs.writeFileSync(filePath, content);

  return {
    fullPath: filePath,
    filename
  };
}

export function generateCaddyConfig(domains: string[]) {
  const config = {
    apps: {
      http: {
        servers: {
          srv0: {
            listen: [":443"],
            routes: domains.map(domain => ({
              match: [
                {
                  host: [domain]
                }
              ],
              handle: [
                {
                  handler: "subroute",
                  routes: [
                    {
                      handle: [
                        {
                          handler: "reverse_proxy",
                          upstreams: [
                            {
                              dial: "localhost:5173"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              terminal: true
            })),
            logs: {
              logger_names: domains.reduce((loggerNames, domain) => {
                // @ts-ignore
                loggerNames[domain] = "stdout";
                return loggerNames;
              }, {})
            }
          }
        }
      },
      tls: {
        automation: {
          policies: [
            {
              subjects: domains,
              issuers: [
                {
                  module: "internal"
                }
              ]
            }
          ]
        }
      }
    }
  };

  return config;
}
