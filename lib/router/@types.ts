import type {
  DefaultState,
  DefaultContext,
  Middleware,
  ParameterizedContext,
} from "koa";

declare module "koa" {
  interface DefaultContext {
    payload: Record<string, unknown>;
  }

  interface Request {
    body?: unknown;
    rawBody: string;
  }
}

export type HTTPMethod =
  | "HEAD"
  | "OPTIONS"
  | "GET"
  | "PUT"
  | "PATCH"
  | "POST"
  | "DELETE";

export type APIMethod =
  | "head"
  | "options"
  | "get"
  | "put"
  | "patch"
  | "post"
  | "del";

// biome-ignore lint:
export interface UseIdentities {}

// biome-ignore lint:
export interface Meta {}

export type MiddlewareDefinition<
  StateT = DefaultState,
  ContextT = DefaultContext,
> = {
  method: APIMethod;
  params: string;
  middleware: Middleware<StateT, ContextT>[];
  payloadValidation?: Middleware[];
};

export type MiddleworkerDefinition<
  StateT = DefaultState,
  ContextT = DefaultContext,
> = {
  method: APIMethod;
  params: string;
  middleworker: Middleworker<StateT, ContextT>;
  payloadValidation?: Middleware[];
};

// use throw inside handler when needed to say NotFound (or another error):
// throw "404: Not Found"
// throw "400: Bad Request"
// throw "statuscode: [some message]"
/** biome-ignore lint: */
type MiddleworkerReturn = any | Promise<any>;

export type Middleworker<StateT = DefaultState, ContextT = DefaultContext> = (
  params: never,
  payload: never,
  ctx: ParameterizedContext<StateT, ContextT>,
) => MiddleworkerReturn;

export type UseScope = APIMethod | Record<APIMethod, RegExp>;
export type UseScopeGlobal = APIMethod;

export type UseDefinitionBase = {
  use: Middleware[];
  name?: keyof UseIdentities;
};

export type UseFactory<TScope> = {
  before: (...p: TScope[]) => UseDefinition<TScope>;
  beforeMatch: (m: APIMethod, p?: string) => boolean;
  after: (...p: TScope[]) => UseDefinition<TScope>;
  afterMatch: (m: APIMethod, p?: string) => boolean;
};

// biome-ignore format:
export type UseDefinition<TScope = UseScope> = UseDefinitionBase & UseFactory<
  TScope
>;

// data provided to routeMapper
export type RouteAssets = {
  name: string;
  path: string;
  file: string;
};

// data returned by routeMapper
export type RouteEndpoint = RouteAssets & {
  base: string;
  params: string;
  method: HTTPMethod;
  middleware: Middleware[];
};
