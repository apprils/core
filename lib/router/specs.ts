import type {
  DefaultState,
  DefaultContext,
  Middleware,
  MiddlewareHandler,
  APIMethod,
  HTTPMethod,
  RouteSpec,
} from "./@types";

export { head, options, get, put, patch, post, del };

function head<StateT = DefaultState, ContextT = DefaultContext>(
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function head<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function head<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function head<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  params: string,
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function head(...args: unknown[]): RouteSpec {
  return specMapper("head", args);
}

function options<StateT = DefaultState, ContextT = DefaultContext>(
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function options<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function options<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function options<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  params: string,
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function options(...args: unknown[]): RouteSpec {
  return specMapper("options", args);
}

function get<StateT = DefaultState, ContextT = DefaultContext>(
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function get<StateT = DefaultState, ContextT = DefaultContext, BodyT = unknown>(
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function get<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function get<StateT = DefaultState, ContextT = DefaultContext, BodyT = unknown>(
  params: string,
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function get(...args: unknown[]): RouteSpec {
  return specMapper("get", args);
}

function put<StateT = DefaultState, ContextT = DefaultContext>(
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function put<StateT = DefaultState, ContextT = DefaultContext, BodyT = unknown>(
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function put<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function put<StateT = DefaultState, ContextT = DefaultContext, BodyT = unknown>(
  params: string,
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function put(...args: unknown[]): RouteSpec {
  return specMapper("put", args);
}

function patch<StateT = DefaultState, ContextT = DefaultContext>(
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function patch<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function patch<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function patch<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  params: string,
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function patch(...args: unknown[]): RouteSpec {
  return specMapper("patch", args);
}

function post<StateT = DefaultState, ContextT = DefaultContext>(
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function post<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function post<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function post<
  StateT = DefaultState,
  ContextT = DefaultContext,
  BodyT = unknown,
>(
  params: string,
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function post(...args: unknown[]): RouteSpec {
  return specMapper("post", args);
}

function del<StateT = DefaultState, ContextT = DefaultContext>(
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function del<StateT = DefaultState, ContextT = DefaultContext, BodyT = unknown>(
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function del<StateT = DefaultState, ContextT = DefaultContext>(
  params: string,
  handler: MiddlewareHandler<StateT, ContextT>,
): RouteSpec<StateT, ContextT>;

function del<StateT = DefaultState, ContextT = DefaultContext, BodyT = unknown>(
  params: string,
  middleware: Middleware<StateT, ContextT, BodyT>[],
): RouteSpec<StateT, ContextT, BodyT>;

function del(...args: unknown[]) {
  return specMapper("del", args);
}

const HTTP_METHOD_BY_API: Record<APIMethod, HTTPMethod> = {
  head: "HEAD",
  options: "OPTIONS",
  get: "GET",
  put: "PUT",
  patch: "PATCH",
  post: "POST",
  del: "DELETE",
};

function specMapper(apiMethod: APIMethod, args: unknown[]) {
  const [params, middleware] = bisectArguments(args);

  return {
    apiMethod,
    params,
    method: HTTP_METHOD_BY_API[apiMethod],
    middleware,
    use: [],
  };
}

function bisectArguments(args: unknown[]): [string, Middleware[]] {
  let params: string;
  let middleware: Middleware[];

  args = args.filter((a) => a);

  if (args.length === 2) {
    if (typeof args[0] === "string") {
      params = args[0];
    } else {
      throw new Error("Path expected to be a string");
    }
    middleware = middlewareMapper(args[1] as MiddlewareHandler | Middleware[]);
  } else if (args.length === 1) {
    params = "";
    middleware = middlewareMapper(args[0] as MiddlewareHandler | Middleware[]);
  } else {
    throw new Error("Expected either [ middleware ] or [ params, middleware ]");
  }

  return [params, middleware];
}

function middlewareMapper(arg: MiddlewareHandler | Middleware[]): Middleware[] {
  if (typeof arg === "function") {
    // MiddlewareHandler
    return [
      async (ctx, next) => {
        ctx.body = await arg(
          ctx,
          "body" in ctx.request ? ctx.request.body : ctx.query,
        );
        return next();
      },
    ];
  } else if (Array.isArray(arg)) {
    // Middleware[]
    return arg;
  } else {
    throw new Error(
      "Middleware supposed to be either a function or an array of functions",
    );
  }
}
