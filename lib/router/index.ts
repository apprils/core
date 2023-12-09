
import { join } from "path";

import type { RouteTemplate, Middleware, RouteEntry, Use } from "./@types";
import store from "./store";
import { pushRouteEntry } from "./print";

export * from "./@types";
export * from "./specs";
export { use } from "./use";
export { debug, warnings } from "./print";
export { config } from "./config";

export function routeMapper(
  routes: Record<string, RouteTemplate>,
): RouteEntry[] {

  const entries: RouteEntry[] = []

  for (const { name, path, file, meta, spec } of Object.values(routes)) {

    const routeUse: Use[] = []

    for (const { name, apiMethod, middleware } of store.use) {
      // creating new objects in the event middleware will be replaced
      routeUse.push({ name, apiMethod, middleware })
    }

    try {

      for (const { use: specUse } of spec.filter((e) => e.use.length)) {

        if (!Array.isArray(specUse)) {
          continue
        }

        for (const { name, apiMethod, middleware } of specUse) {

          if (name) {

            const prevUse = routeUse.filter((e) => e.name === name)

            if (prevUse.length) {
              for (const prevUseEntry of prevUse) {
                prevUseEntry.apiMethod = apiMethod
                prevUseEntry.middleware = middleware
              }
            }
            else {
              routeUse.push({ name, apiMethod, middleware })
            }

          }
          else {
            routeUse.push({ name, apiMethod, middleware })
          }

        }

      }

    }
    catch (error) {
      console.error("Failed injecting `use` middleware")
      console.log({ name, path, file }, spec)
      throw error
    }

    try {
      for (const entry of spec) {

        if (entry.use.length) {
          continue
        }

        const { apiMethod, params, method, middleware } = entry
        const useMiddleware: Middleware[] = []

        for (const use of routeUse) {

          const [ useMethod, useParams ] = use.apiMethod

          if (useMethod !== apiMethod) {
            continue
          }

          if (typeof useParams === "string" && ![ params, "*" ].includes(useParams)) {
            continue
          }

          useMiddleware.push(...use.middleware)

        }

        entries.push({
          name,
          base: path,
          path: join(path, params),
          params,
          method,
          file,
          meta,
          middleware: [ ...useMiddleware, ...middleware ],
        })

      }
    }
    catch (error) {
      console.error("Failed inserting route entry")
      console.log({ name, path, file }, spec)
      throw error
    }

    pushRouteEntry({ name, path, file, spec })

  }

  return entries

}

