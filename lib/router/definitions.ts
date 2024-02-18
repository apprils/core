import type {
  DefaultState,
  DefaultContext,
  APIMethod,
  UseDefinition,
  UseDefinitionBase,
  UseIdentities,
  UsePosition,
  UsePositionGlobal,
  MiddlewareDefinition,
  Middleware,
  MiddleworkerDefinition,
  Middleworker,
} from "./@types";

import store from "./store";

export { use, useGlobal, head, options, get, put, patch, post, del };

// head
function head<StateT = DefaultState, ContextT = DefaultContext>(
  middleworker: Middleworker<StateT, ContextT>,
): MiddleworkerDefinition<StateT, ContextT>;

function head<StateT = DefaultState, ContextT = DefaultContext>(
  middleware: Middleware<StateT, ContextT>[],
): MiddlewareDefinition<StateT>;

function head<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  middleware: Middleware<StateT, ContextT>[],
): MiddlewareDefinition<StateT>;

function head<StateT = DefaultState, ContextT = DefaultContext>(
  ...args: unknown[]
) {
  return definitionFactory<StateT, ContextT>("head", args);
}

// options
function options<StateT = DefaultState, ContextT = DefaultContext>(
  middleworker: Middleworker<StateT, ContextT>,
): MiddleworkerDefinition<StateT, ContextT>;

function options<StateT = DefaultState, ContextT = DefaultContext>(
  middleware: Middleware<StateT, ContextT>[],
): MiddlewareDefinition<StateT>;

function options<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  middleware: Middleware<StateT, ContextT>[],
): MiddlewareDefinition<StateT>;

function options<StateT = DefaultState, ContextT = DefaultContext>(
  ...args: unknown[]
) {
  return definitionFactory<StateT, ContextT>("options", args);
}

// get
function get<StateT = DefaultState, ContextT = DefaultContext>(
  middleworker: Middleworker<StateT, ContextT>,
): MiddleworkerDefinition<StateT, ContextT>;

function get<StateT = DefaultState, ContextT = DefaultContext>(
  middleware: Middleware<StateT, ContextT>[],
): MiddleworkerDefinition<StateT, ContextT>;

function get<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  middleware: Middleware<StateT, ContextT>[],
): MiddleworkerDefinition<StateT, ContextT>;

function get(...args: unknown[]) {
  return definitionFactory("get", args);
}

// put
function put<StateT = DefaultState, ContextT = DefaultContext>(
  middleworker: Middleworker<StateT, ContextT>,
): MiddleworkerDefinition<StateT, ContextT>;

function put<StateT = DefaultState, ContextT = DefaultContext>(
  middleware: Middleware<StateT, ContextT>[],
): MiddleworkerDefinition<StateT, ContextT>;

function put<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  middleware: Middleware<StateT, ContextT>[],
): MiddleworkerDefinition<StateT, ContextT>;

function put(...args: unknown[]) {
  return definitionFactory("put", args);
}

// patch
function patch<StateT = DefaultState, ContextT = DefaultContext>(
  middleworker: Middleworker<StateT, ContextT>,
): MiddleworkerDefinition<StateT, ContextT>;

function patch<StateT = DefaultState, ContextT = DefaultContext>(
  middleware: Middleware<StateT, ContextT>[],
): MiddleworkerDefinition<StateT, ContextT>;

function patch<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  middleware: Middleware<StateT, ContextT>[],
): MiddleworkerDefinition<StateT, ContextT>;

function patch(...args: unknown[]) {
  return definitionFactory("patch", args);
}

// post
function post<StateT = DefaultState, ContextT = DefaultContext>(
  middleworker: Middleworker<StateT, ContextT>,
): MiddleworkerDefinition<StateT, ContextT>;

function post<StateT = DefaultState, ContextT = DefaultContext>(
  middleware: Middleware<StateT, ContextT>[],
): MiddleworkerDefinition<StateT, ContextT>;

function post<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  middleware: Middleware<StateT, ContextT>[],
): MiddleworkerDefinition<StateT, ContextT>;

function post(...args: unknown[]) {
  return definitionFactory("post", args);
}

// del
function del<StateT = DefaultState, ContextT = DefaultContext>(
  middleworker: Middleworker<StateT, ContextT>,
): MiddleworkerDefinition<StateT, ContextT>;

function del<StateT = DefaultState, ContextT = DefaultContext>(
  middleware: Middleware<StateT, ContextT>[],
): MiddleworkerDefinition<StateT, ContextT>;

function del<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  middleware: Middleware<StateT, ContextT>[],
): MiddleworkerDefinition<StateT, ContextT>;

function del(...args: unknown[]) {
  return definitionFactory("del", args);
}

// use
function use(middleware: Middleware): UseDefinition;
function use(middleware: Middleware[]): UseDefinition;

function use(
  namespace: keyof UseIdentities,
  middleware: Middleware,
): UseDefinition;

function use(
  namespace: keyof UseIdentities,
  middleware: Middleware[],
): UseDefinition;

function use(...args: unknown[]) {
  return useDefinitionFactory<UsePosition>(args);
}

// useGlobal
function useGlobal(middleware: Middleware): UseDefinition<UsePositionGlobal>;
function useGlobal(middleware: Middleware[]): UseDefinition<UsePositionGlobal>;

function useGlobal(
  namespace: keyof UseIdentities,
  middleware: Middleware,
): UseDefinition<UsePositionGlobal>;

function useGlobal(
  namespace: keyof UseIdentities,
  middleware: Middleware[],
): UseDefinition<UsePositionGlobal>;

function useGlobal(...args: unknown[]) {
  return useDefinitionFactory<UsePositionGlobal>(args, (e) =>
    store.useGlobal.push(e),
  );
}

// factories / builders
function definitionFactory<StateT, ContextT>(
  method: APIMethod,
  args: unknown[],
):
  | MiddlewareDefinition<StateT, ContextT>
  | MiddleworkerDefinition<StateT, ContextT> {
  if (args.length === 1) {
    if (typeof args[0] === "function") {
      return {
        method,
        params: "", // default params, to be overridden by middleworkerParams
        middleworker: args[0] as Middleworker<StateT, ContextT>,
      };
    }

    if (Array.isArray(args[0])) {
      return {
        method,
        params: "",
        middleware: args[0] as Middleware<StateT, ContextT>[],
      };
    }

    throw new Error(
      "When single argument provided, it is supposed to be a function or an array of functions",
    );
  }

  if (args.length === 2) {
    if (typeof args[0] !== "string") {
      throw new Error(
        "When 2 arguments provided, first argument expected to be a string",
      );
    }

    if (!Array.isArray(args[1])) {
      throw new Error(
        "When 2 arguments provided, second argument expected to be a middleware array",
      );
    }

    return {
      method,
      params: args[0],
      middleware: args[1] as Middleware<StateT, ContextT>[],
    };
  }

  throw new Error(`Expected 1-2 arguments, received ${args.length}`);
}

function useDefinitionFactory<PositionT>(
  args: unknown[],
  callback?: (d: UseDefinition<PositionT>) => void,
): UseDefinition<PositionT> {
  const definition = useDefinitionBuilder(args);

  let $before: PositionT[] = [];
  let $after: PositionT[] = [];

  Object.defineProperties(definition, {
    before: {
      value: (...p: PositionT[]) => {
        // do not push, rather replace! (to be able to override by later call)
        $before = p;
        return definition;
      },
    },
    $before: {
      get() {
        return $before;
      },
    },
    after: {
      value: (...p: PositionT[]) => {
        // do not push, rather replace! (to be able to override by later call)
        $after = p;
        return definition;
      },
    },
    $after: {
      get() {
        return $after;
      },
    },
  });

  callback?.(definition as UseDefinition<PositionT>);

  return definition as UseDefinition<PositionT>;
}

function useDefinitionBuilder(args: unknown[]): UseDefinitionBase {
  let name: keyof UseIdentities | undefined;
  let use: Middleware[] = [];

  if (args.length === 2) {
    if (typeof args[0] === "string") {
      name = args[0] as keyof UseIdentities;
    } else {
      throw new Error("First argument expected to be a string");
    }

    if (typeof args[1] === "function") {
      use = [args[1]] as Middleware[];
    } else if (Array.isArray(args[1])) {
      use = args[1];
    } else {
      throw new Error("Second argument expected to be a function");
    }
  } else if (args.length === 1) {
    if (typeof args[0] === "function") {
      use = [args[0]] as Middleware[];
    } else if (Array.isArray(args[0])) {
      use = args[0];
    } else {
      throw new Error("Second argument expected to be a function");
    }
  } else {
    throw new Error(`Expected 1-2 arguments, received ${args.length}`);
  }

  return { use, name };
}
