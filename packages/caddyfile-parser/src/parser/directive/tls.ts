import { TLSCoreDirective, TLSDirective } from "../types.js";

const TLSCoreExtract = /(?!\stls)\s(?<certificate>\S+)\s(?<key>\S+)(?<!{)/;

export function ProcessTLSDirective(directive: string): TLSDirective {
  const core = TLSCoreExtract.exec(directive)
    ?.groups as unknown as TLSCoreDirective;
  return { ...core, type: "tls" };
}
