
import type {
  DefaultState, DefaultContext,
  Middleware, NamedMiddleware,
  Use, UseMethodMap, UseMethodEntry,
  APIMethod, RouteSpec,
} from "./@types";

import * as specs from "./specs";
import { pushWarningEntry } from "./print";

export { use }

/**
  * use on any method any params
  * */

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
>(
  middleware: Middleware<StateT, ContextT>
): RouteSpec<StateT, ContextT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
>(
  middleware: Middleware<StateT, ContextT>[],
): RouteSpec<StateT, ContextT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
>(
  middleware: NamedMiddleware<StateT, ContextT>[],
): RouteSpec<StateT, ContextT>;

/*
  * use only on get and post
  *   use([ "get", "post" ], ...)
  */

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
>(
  apiMethods: APIMethod[],
  middleware: Middleware<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
>(
  apiMethods: APIMethod[],
  middleware: Middleware<StateT, ContextT>[],
): RouteSpec<StateT, ContextT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
>(
  apiMethods: APIMethod[],
  middleware: NamedMiddleware<StateT, ContextT>[],
): RouteSpec<StateT, ContextT>;

/*
  * use only on get(":id")
  *   use({ get: ":id" }, ...)
  *
  * use only on get(":id") or get without params
  *   use({ get: [ ":id", "" ] }, ...)
  *
  * use only on get(":id") and any post
  *   use({ get: ":id", post: "*" })
  */

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
>(
  apiMethods: UseMethodMap,
  middleware: Middleware<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
>(
  apiMethods: UseMethodMap,
  middleware: Middleware<StateT, ContextT>[],
): RouteSpec<StateT, ContextT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
>(
  apiMethods: UseMethodMap,
  middleware: NamedMiddleware<StateT, ContextT>[],
): RouteSpec<StateT, ContextT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
>(
  ...args: unknown[]
): RouteSpec<StateT, ContextT> {
  return {
    // formal definitions to match RouteSpec
    apiMethod: "head", method: "HEAD", params: "", middleware: [],
    use: useMapper<StateT, ContextT>(args),
  }
}

/**
* using NamedMiddleware[] cause object iteration does not always guarantee insertion order.
* eg: use({ abc: x, 2: x, 1: x }) would iterate as ["1", "2", "abc"]
* to ensure middleware execution in the insertion order, using an array of named middleware:
* eg: use([ { abc: x }, { 2: x }, { 1: x } ]) would always iterate as [ "abc", "2", "1" ]
* TODO: find a way to enforce single key objects at compile time, using typescript.
*/
function useMapper<
  StateT,
  ContextT,
>(
  args: unknown[],
): Use<StateT, ContextT>[] {

  let _apiMethods: UseMethodEntry[] = []
  let _use: ReturnType<typeof middlewareMapper<StateT, ContextT>>

  if (args.length === 2) {

    if (Array.isArray(args[0])) {
      _apiMethods = args[0].map((e) => [ e, undefined ])
    }
    else {
      _apiMethods = Object.entries(args[0] as UseMethodMap) as UseMethodEntry[]
    }

    _use = middlewareMapper<StateT, ContextT>(args[1])

  }
  else if (args.length === 1) {

    if (typeof args[0] === "object" && args[0] !== null && "use" in args[0]) {
      return args[0].use as Use<StateT, ContextT>[]
    }

    _apiMethods = Object.keys(specs).map((e) => [ e, undefined ]) as UseMethodEntry[]
    _use = middlewareMapper<StateT, ContextT>(args[0])

  }
  else {
    throw new Error(`Wrong number of arguments, expected 1 or 2, given ${ args.length }`)
  }

  const use: Use<StateT, ContextT>[] = []

  for (const apiMethod of _apiMethods) {
    for (const { name, middleware } of _use) {
      use.push({ name, apiMethod, middleware })
    }
  }

  return use

}

function middlewareMapper<
  StateT,
  ContextT,
>(arg: unknown): {
  name?: string,
  middleware: Middleware<StateT, ContextT>[]
}[] {

  const entries: any = []

  if (typeof arg === "function") {
    entries.push({ middleware: [ arg ] })
  }
  else if (Array.isArray(arg)) {

    for (const entry of arg) {

      if (typeof entry === "function") {
        entries.push({ middleware: [ entry ] })
      }
      else if (Object.prototype.toString.call(entry) === "[object Object]") {

        if (Object.keys(entry).length > 1) {
          pushWarnings(entry)
        }

        const _entries = Object.entries(entry)

        for (const [ name, middleware ] of _entries) {
          if (Array.isArray(middleware)) {
            entries.push({ name, middleware })
          }
          else if (typeof middleware === "function") {
            entries.push({ name, middleware: [ middleware ] })
          }
          else {
            throw new Error("Expected a function or an array of functions")
          }
        }

      }
      else {
        throw new Error("Expected a function or an object")
      }

    }

  }
  else {
    throw new Error("Expected a function or an array of functions")
  }

  return entries

}

function pushWarnings(entry: Record<string, any>) {

  const keys = Object.keys(entry)

  pushWarningEntry([
    "It is highly recommended to use single key objects for NamedMiddleware!",
    "Object iteration does not always guarantee insertion order!",
    `So consider to use([ ${ keys.map((k) => `{ ${ k }: fn }`).join(", ") } ])`,
    `instead of use([ { ${ keys.map((k) => `${ k }: fn`).join(", ") } } ])`,
  ])

}

