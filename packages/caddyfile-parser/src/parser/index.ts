import {
  HTTPDirectiveTypes,
  DirectiveTypes,
  CaddyFile,
  HTTPDirectiveTypesType,
  BINDDirective
} from "./types.js";
import { processProxyDirective } from "../parser/directive/proxy.js";
import { processBasicAuthDirective } from "../parser/directive/basic-auth.js";
import { ProcessTLSDirective } from "../parser/directive/tls.js";
import { processGZIP } from "./directive/gzip.js";

const commentTest = /^#.*/;
const textTest = /\S+(?<!\s{)/;
const bracketTest = /.*{/;
const closeBracketTest = /.*}/;

// @ts-ignore
const getLayer = (CaddyFile: CaddyFile, path: string[]): any =>
  path.reduce((obj, prop) => obj[prop], CaddyFile);

const directiveTest = new RegExp(
  `(?!\\s)(${Object.entries(HTTPDirectiveTypes)
    .map(([value], a, b) => (a === b.length - 1 ? `${value}` : `${value}|`))
    .join("")})`
);

function extractDirective<T extends HTTPDirectiveTypesType>(
  directive: T,
  directiveString: string
): DirectiveTypes {
  if (directive === "basicauth")
    return processBasicAuthDirective(directiveString);
  else if (directive === "proxy") return processProxyDirective(directiveString);
  else if (directive === "tls") return ProcessTLSDirective(directiveString);
  else if (directive === "gzip") return processGZIP(directiveString);
  else if (directive === "bind")
    return {
      type: "bind",
      ...(/(?!.*bind)\s(?<host>.*)/.exec(directiveString)
        .groups as unknown as BINDDirective)
    };
}

/**
 *
 * @param CaddyFile CaddyFile as a string.
 */
export function parseCaddyFile(CaddyFileSTR: string): CaddyFile {
  const lines = CaddyFileSTR.split(/\n/);

  const CaddyFileOBJ: CaddyFile = {};

  /**
   * Current path in which to add stuff
   */
  const path: string[] = [];
  let comment: string;
  let directive: string;

  for (const line of lines) {
    if (commentTest.test(line)) {
      if (comment) comment = `${comment}\n${line}`;
    } else if (path.length < 1 && textTest.test(line)) {
      CaddyFileOBJ[textTest.exec(line)[0]] = { directives: [] };
      path.push(textTest.exec(line)[0]);
    } else if (directiveTest.test(line) && !bracketTest.test(line)) {
      getLayer(CaddyFileOBJ, path).directives.push(
        extractDirective(
          directiveTest.exec(line)[0] as keyof typeof HTTPDirectiveTypes,
          line
        )
      );
    } else if (directiveTest.test(line) && bracketTest.test(line))
      directive = line;
    else if (/\S+/.test(line) && directive) {
      directive = `${directive}\n${line.replace(/(\s|\t){2,}/g, "")}`;
      if (closeBracketTest.test(line)) {
        getLayer(CaddyFileOBJ, path).directives.push(
          extractDirective(
            directiveTest.exec(directive)[0] as keyof typeof HTTPDirectiveTypes,
            directive
          )
        );
        directive = undefined;
      }
    } else if (closeBracketTest.test(line)) directive = undefined;
  }

  return CaddyFileOBJ;
}
