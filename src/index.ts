import type { Plugin } from "vite";
import chalk from "chalk";
import { spawn } from "child_process";
import { validateCaddyIsInstalled, writeTempFile } from "./utils";

const cwd = process.cwd();

function generateCaddyConfig(domains: string[]) {
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

export default function viteCaddyTlsPlugin({
  domains,
  cors
}: {
  domains: string | string[];
  cors?: string;
}): Plugin {
  return {
    name: "vite:caddy-tls",
    async configureServer() {
      validateCaddyIsInstalled();

      const domainArray = Array.isArray(domains) ? domains : [domains];
      const generatedConfig = generateCaddyConfig(domainArray);

      const caddyConfigPath = writeTempFile(
        JSON.stringify(generatedConfig, null, 2),
        "caddy.json"
      );

      // run caddy cli to start the server
      const caddyCommand = `caddy run --config ${caddyConfigPath}`;
      console.log(caddyCommand);
      const handle = spawn(caddyCommand, {
        shell: true
      });

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
    }
  };
}
