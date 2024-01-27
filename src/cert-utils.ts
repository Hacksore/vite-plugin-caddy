import fs from "node:fs";

export function convertCrtToPem(crtFilePath: string, outDir: string) {
  // Read the CRT file
  const crtData = fs.readFileSync(crtFilePath, "utf8");

  // Convert CRT to PEM
  const pemData = `-----BEGIN CERTIFICATE-----\n${crtData}\n-----END CERTIFICATE-----`;

  // Save the PEM data to a new file
  fs.writeFileSync(outDir, pemData, "utf8");
}
