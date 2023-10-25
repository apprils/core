
import type {
  DefaultState, DefaultContext,
  Middleware, NamedMiddleware,
  Use, APIMethod, RouteSpec,
} from "./@types";

import * as specs from "./specs";
import { pushWarningEntry } from "./print";

export { use }

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  middleware: Middleware<StateT, ContextT>
): RouteSpec<StateT, ContextT, BodyT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  middleware: Middleware<StateT, ContextT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  middleware: NamedMiddleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  apiMethods: APIMethod[],
  middleware: Middleware<StateT, ContextT>,
): RouteSpec<StateT, ContextT, BodyT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  apiMethods: APIMethod[],
  middleware: Middleware<StateT, ContextT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  apiMethods: APIMethod[],
  middleware: NamedMiddleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function use<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  ...args: unknown[]
): RouteSpec<StateT, ContextT, BodyT> {
  return {
    // formal definitions to match RouteSpec
    apiMethod: "head", method: "HEAD", params: "", middleware: [],
    use: $use<StateT, ContextT, BodyT>(args),
  }
}

/**
* using NamedMiddleware[] cause object iteration does not always guarantee insertion order.
* eg: use({ abc: x, 2: x, 1: x }) would iterate as ["1", "2", "abc"]
* to ensure middleware execution in the insertion order, using an array of named middleware:
* eg: use([ { abc: x }, { 2: x }, { 1: x } ]) would always iterate as [ "abc", "2", "1" ]
* TODO: find a way to enforce single key objects at compile time, using typescript.
*/
function $use<
  StateT,
  ContextT,
  BodyT,
>(
  args: unknown[],
): Use<StateT, ContextT, BodyT>[] {

  let _apiMethods: APIMethod[]
  let _use: ReturnType<typeof middlewareMapper<StateT, ContextT, BodyT>>

  if (args.length === 2) {

    _apiMethods = args[0] as APIMethod[]
    _use = middlewareMapper<StateT, ContextT, BodyT>(args[1])

  }
  else if (args.length === 1) {

    if (typeof args[0] === "object" && args[0] !== null && "use" in args[0]) {
      return args[0].use as Use<StateT, ContextT>[]
    }

    _apiMethods = []
    _use = middlewareMapper<StateT, ContextT, BodyT>(args[0])

  }
  else {
    throw new Error(`Wrong number of arguments, expected 1 or 2, given ${ args.length }`)
  }

  if (!Array.isArray(_apiMethods)) {
    throw new Error(`Expected an array of API Methods, use any of ${ Object.keys(specs) }`)
  }

  if (!_apiMethods.length) {
    _apiMethods = Object.keys(specs) as APIMethod[]
  }

  const use: Use<StateT, ContextT, BodyT>[] = []

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
  BodyT,
>(arg: unknown): {
  name?: string,
  middleware: Middleware<StateT, ContextT, BodyT>[]
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

