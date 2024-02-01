import fs from "node:fs";
import { execSync } from "child_process";

/**
 * a Caddyfile "parser" that gets all the domain names
 *
 * @returns {string[]} the domain names from the Caddyfile
 */
export function parseNamesFromCaddyFile(caddyFilePath: string) {
  const names: string[] = [];
  const caddyFile = fs.readFileSync(caddyFilePath, "utf-8");
  const lines = caddyFile.split("\n");

  // iterate the lines and only give me the ones that end in {
  for (const line of lines) {
    if (line.endsWith("{")) {
      // get the domain name
      const [domain] = line.split(" ");
      names.push(domain);
    }
  }

  return names;
}

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
