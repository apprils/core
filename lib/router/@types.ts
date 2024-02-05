
import type { DefaultState, ParameterizedContext, Next } from "koa";
import type { RouterParamContext } from "koa__router";
import type { Stream } from "stream";

declare module "koa" {
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
  | "DELETE"

export type APIMethod =
  | "head"
  | "options"
  | "get"
  | "put"
  | "patch"
  | "post"
  | "del"

export type { DefaultState, Next }

export type Ctx<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
> = ParameterizedContext<
  StateT,
  ContextT & RouterParamContext<StateT, ContextT>,
  BodyT
>

export interface DefaultContext {}

export type Middleware<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
> = (
  ctx: Ctx<StateT, ContextT, BodyT>,
  next: Next,
) => any

export type NamedMiddleware<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
> = Record<
  string,
  Middleware<StateT, ContextT> | Middleware<StateT, ContextT>[]
>

// use throw when needed to say NotFound (or another error):
// throw "404: Not Found"
// throw "400: Bad Request"
// throw "statuscode: [some message]"
export type MiddlewareHandlerReturn =
  | string
  | number
  | boolean
  | null
  | Stream
  | Buffer
  | any[]
  | Record<string, any>

export type MiddlewareHandler<
  StateT = DefaultState,
  ContextT = DefaultContext,
> = (
  ctx: Ctx<StateT, ContextT>,
  payload?: any,
) => Promise<MiddlewareHandlerReturn>

export type Use<
  StateT = DefaultState,
  ContextT = DefaultContext,
> = {
  name?: string;
  apiMethod: UseMethodEntry;
  middleware: Middleware<StateT, ContextT>[];
}

export type UseMethodMap = Partial<Record<APIMethod, string|string[]>>

export type UseMethodEntry = [ method: APIMethod, params?: string | string[] ]

export type RouteTemplate = Record<string, any> & {
  name: string;
  path: string;
  file: string;
  meta: any;
  spec: RouteSpec[];
}

export type RouteSpec<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
> = {
  apiMethod: APIMethod;
  method: HTTPMethod;
  params: string;
  middleware: Middleware<StateT, ContextT, BodyT>[];
  use: Use<StateT, ContextT>[];
}

export type RouteEntry = {
  name: string;
  base: string;
  path: string;
  params: string;
  method: HTTPMethod;
  file: string;
  meta: any;
  middleware: any[];
}

