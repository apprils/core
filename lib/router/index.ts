import { join } from "path";
import { randomUUID } from "crypto";

import type {
  APIMethod,
  HTTPMethod,
  Middleware,
  MiddlewareDefinition,
  MiddleworkerDefinition,
  UsePosition,
  UseDefinition,
  RouteAssets,
  RouteEndpoint,
} from "./@types";

import store from "./store";
import { pushRouteEndpoints } from "./print";

export * from "./@types";
export * from "./definitions";
export { debug, warnings } from "./print";

type Definition = UseDefinition | MiddleworkerDefinition | MiddlewareDefinition;

// converting raw definitions into route endpoints.
// route endpoints contains all necessary data for router.register
export function routeMapper(
  definitions: Definition[],
  routeAssets: RouteAssets,
  middleworkerParams: Record<number, string>,
  payloadValidation?: Record<number, Middleware[]>,
): RouteEndpoint[] {
  const { name, path, file } = routeAssets;
  const endpoints: RouteEndpoint[] = [];

  const useDefinitions: UseDefinition[] = [];
  const middlewareDefinitions: MiddlewareDefinition[] = [];
  const middleworkerDefinitions: MiddleworkerDefinition[] = [];

  for (const [i, definition] of definitions.entries()) {
    if ("use" in definition) {
      useDefinitions.push(definition);
    } else if ("middleware" in definition) {
      middlewareDefinitions.push({
        ...definition,
        payloadValidation: payloadValidation?.[i],
      });
    } else if ("middleworker" in definition) {
      middleworkerDefinitions.push({
        ...definition,
        // biome-ignore format:
        ...middleworkerParams[i]
          ? { params: middleworkerParams[i] }
          : {},
        payloadValidation: payloadValidation?.[i],
      });
    }
  }

  for (const {
    method,
    params,
    middleware,
    payloadValidation,
  } of middlewareDefinitions) {
    const [before, after] = usePartitioner(useDefinitions, { method, params });
    endpoints.push({
      name,
      base: path,
      path: join(path, params),
      params,
      method: httpMethodByApi(method),
      file,
      middleware: [
        ...before,
        ...(payloadValidation || []),
        ...middleware,
        ...after,
        () => true,
      ],
    });
  }

  for (const {
    method,
    params,
    middleworker,
    payloadValidation,
  } of middleworkerDefinitions) {
    const [before, after] = usePartitioner(useDefinitions, { method, params });

    const middleware: Middleware[] = [
      async (ctx, next) => {
        ctx.body = await middleworker(
          ctx.params as never,
          ctx.payload as never,
          ctx,
        );
        return next();
      },
    ];

    endpoints.push({
      name,
      base: path,
      path: join(path, params),
      params,
      method: httpMethodByApi(method),
      file,
      middleware: [
        ...before,
        ...(payloadValidation || []),
        ...middleware,
        ...after,
        () => true,
      ],
    });
  }

  pushRouteEndpoints(routeAssets, endpoints);

  return endpoints;
}

function usePartitioner(
  useDefinitions: UseDefinition[],
  assets: {
    method: APIMethod;
    params: string;
  },
): [before: Middleware[], Middleware[]] {
  const { method, params } = assets;

  const before: Record<string, Middleware[]> = {};
  const after: Record<string, Middleware[]> = {};

  const idFactory = (name: string | undefined): string => {
    return ["@use", method, name || randomUUID()].join(":");
  };

  for (const { use, name, $before, $after } of store.useGlobal) {
    const id = idFactory(name);
    if ($before.includes(method)) {
      before[id] = use;
    }
    if ($after.includes(method)) {
      after[id] = use;
    }
  }

  for (const { use, name, $before, $after } of useDefinitions) {
    const id = idFactory(name);

    const match = (p: UsePosition) => {
      if (typeof p === "string") {
        return p === method;
      }
      for (const [meth, regx] of Object.entries(p)) {
        if (meth === method && regx.test?.(params)) {
          return true;
        }
      }
    };

    if ($before.some(match)) {
      before[id] = use;
    }
    if ($after.some(match)) {
      after[id] = use;
    }
  }

  return [Object.values(before).flat(), Object.values(after).flat()];
}

export function httpMethodByApi(apiMethod: APIMethod): HTTPMethod {
  return apiMethod === "del"
    ? "DELETE"
    : (apiMethod.toUpperCase() as HTTPMethod);
}
