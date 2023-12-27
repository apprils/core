
import type { APIMethod, Middleware, NamedMiddleware, UseMethodMap } from "./@types";

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
  methods: UseMethodMap,
  resolver: Middleware,
): void;

function use(
  methods: UseMethodMap,
  resolver: Middleware[],
): void;

function use(
  methods: UseMethodMap,
  resolver: NamedMiddleware[],
): void;

function use(
  ...args: unknown[]
): void {

  // @ts-expect-error
  const { use: entries } = $use.use(...args)

  store.use.push(...entries)

}

export const config = {
  use,
}

export default config

