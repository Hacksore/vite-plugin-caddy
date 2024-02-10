import { GZIPDirective } from "../types.js";

export function processGZIP(directiveString: string): GZIPDirective {
  return { type: "gzip" };
}
