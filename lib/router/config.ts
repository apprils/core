
import type { APIMethod, Middleware, NamedMiddleware } from "./@types";

import * as $use from "./use";
import store from "./store";

function use(
  middleware: Middleware,
): void;

function use(
  middleware: Middleware[],
): void;

function use(
  middleware: NamedMiddleware[],
): void;

function use(
  methods: APIMethod[],
  resolver: Middleware,
): void;

function use(
  methods: APIMethod[],
  resolver: Middleware[],
): void;

function use(
  methods: APIMethod[],
  resolver: NamedMiddleware[],
): void;

function use(
  ...args: unknown[]
): void {

  const { use: entries } = args.length === 2
    ? $use.use(args[0] as APIMethod[], args[1] as Middleware[])
    : $use.use(args[0] as Middleware[])

  store.use.push(...entries)

}

export const config = {
  use,
}

export default config

