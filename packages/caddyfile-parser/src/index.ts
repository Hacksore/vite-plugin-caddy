import { CaddyfileParser } from "./parser.js";

interface Caddyfile {
  host: string;
}

export const parseCaddyFile = (caddyfile: string): Caddyfile[] => {
  console.log("Creating caddyfile parser");
  const parser = new CaddyfileParser(caddyfile);
  console.log("Parsing caddyfile");
  const ast = parser.parse();
  console.log(ast);

  return [];
};
