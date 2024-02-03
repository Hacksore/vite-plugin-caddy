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
export function writeTempFile(content: string, fileName: string) {
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, fileName);

  fs.writeFileSync(filePath, content);

  return filePath;
}
