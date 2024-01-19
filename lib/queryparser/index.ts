
import type Koa from "koa";
import { parse, stringify } from "qs";
import type { IParseOptions, IStringifyOptions } from "qs";

export default function withQueryparser<
  T extends InstanceType<
    typeof Koa<
      Koa.DefaultState,
      Koa.DefaultContext
    >
  > = never
>(
  app: T,
  parseOptions: IParseOptions = {},
  stringifyOptions: IStringifyOptions = {},
) {

  parseOptions = {
    ignoreQueryPrefix: true,
    parseArrays: true,
    arrayLimit: 100,
    parameterLimit: 100,
    depth: 5,
    ...parseOptions
  }

  stringifyOptions = {
    encodeValuesOnly: true,
    arrayFormat: "brackets",
    ...stringifyOptions
  }

  const obj = {

    get query() {
      return parse((this as any).querystring || "", parseOptions)
    },

    set query(obj: object) {
      (this as any).querystring = stringify(obj, stringifyOptions)
    }

  }

  const entries = Object.getOwnPropertyNames(obj).map((name) => [
    name,
    Object.getOwnPropertyDescriptor(obj, name)
  ]) as [ name: string, desc: PropertyDescriptor ][]

  for (const [ name, desc ] of entries) {
    Object.defineProperty(app.request, name, desc)
  }

  return app

}

