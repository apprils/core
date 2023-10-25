
import type { DefaultState, ParameterizedContext, Next } from "koa";
import type { RouterParamContext } from "koa__router";

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

export type Env<
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
  env: Env<StateT, ContextT, BodyT>,
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

export type Use<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
> = {
  name?: string,
  apiMethod: APIMethod,
  middleware: Middleware<StateT, ContextT, BodyT>[],
}

export type RouteTemplate = Record<string, any> & {
  name: string,
  path: string,
  file: string,
  meta: any,
  spec: RouteSpec[],
}

export type RouteSpec<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
> = {
  apiMethod: APIMethod,
  method: HTTPMethod,
  params: string,
  middleware: Middleware<StateT, ContextT, BodyT>[],
  use: Use<StateT, ContextT, BodyT>[],
}

export type RouteEntry = {
  name: string,
  base: string,
  path: string,
  params: string,
  method: HTTPMethod,
  file: string,
  meta: any,
  middleware: any[],
}

