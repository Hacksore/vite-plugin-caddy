import fs from "node:fs";

export function convertCrtToPemFile(crtFilePath: string, outDir: string) {
  // Read the CRT file
  const crtData = fs.readFileSync(crtFilePath, "utf8");

  // remove everything after the last block for the cert but still preserve the last closing block 
  const crtDataClean = crtData.replace(/(?<=-----END CERTIFICATE-----)([\s\S]*)/, "");

  // Save the PEM data to a new file
  fs.writeFileSync(outDir, crtDataClean, "utf8");
}

