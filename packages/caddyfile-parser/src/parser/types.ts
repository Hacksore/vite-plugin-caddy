export interface CaddyFileType {
  blocks: Block[];
}

export enum HTTPDirectiveTypes {
  'basicauth' = 'basicauth',
  'proxy' = 'proxy',
  'tls' = 'tls',
  'gzip' = 'gzip',
  'bind' = 'bind',
  'expvar' = 'expvar'
}

export type HTTPDirectiveTypesType = 'basicauth' | 'proxy' | 'tls' | 'gzip' | 'bind' | 'expvar' | HTTPDirectiveTypes;

export interface Block {
  directives: DirectiveTypes[];
}

export type CaddyFile = { [key: string]: Block };

export interface BasicAuthCoreDirective {
  type: 'basicauth';
  username: string;
  password: string;
}

export interface BasicAuthPathDirective extends BasicAuthCoreDirective {
  path: string;
}

export interface BasicAuthDirective extends BasicAuthCoreDirective {
  realm: string;
  files: string[];
}

export interface ProxyCoreDirective {
  type: 'proxy';
  from: string;
  to: string;
}

export interface ProxyDirective extends ProxyCoreDirective {
  websocket?: boolean;
}

export interface HTTPDirectives {
  basicauth: BasicAuthDirective;
  proxy: ProxyDirective;
}

export interface Directive {
  type: DirectiveTypes;
}

export interface WebBlock {
  server: string | string[];
}

export interface TLSCoreDirective {
  type: 'tls';
  certificate: string;
  key: string;
}

export interface GZIPCoreDirective {
  type: 'gzip';
}

export interface GZIPMainDirective extends GZIPCoreDirective {
  level: number;
}

export type GZIPDirective = GZIPCoreDirective | GZIPMainDirective;

export interface TLSDirective extends TLSCoreDirective {}

export interface BINDDirective {
  type: 'bind';
  host: string;
}

export interface EXPVarDirective {
  type: 'expvar';
  path?: string;
}

export type DirectiveTypes =
  | BasicAuthDirective
  | ProxyDirective
  | BasicAuthPathDirective
  | TLSDirective
  | GZIPDirective
  | EXPVarDirective
  | BINDDirective;
