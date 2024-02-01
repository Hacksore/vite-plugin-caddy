import fs from "node:fs";

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
