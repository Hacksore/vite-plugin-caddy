import {
  ProxyDirective,
  HTTPDirectiveTypes,
  ProxyCoreDirective
} from "../types.js";

const ProxyCoreExtract = /(?!\sproxy)\s(?<from>\S+)\s(?<to>\S+)(?<!{)/;

export function processProxyDirective(directive: string): ProxyDirective {
  const core = ProxyCoreExtract.exec(directive)
    ?.groups as unknown as ProxyCoreDirective;
  const websocket = directive.includes("websocket");

  // @ts-ignore
  return { type: HTTPDirectiveTypes["proxy"], ...core, websocket };
}
