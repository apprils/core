import {
  green,
  blue,
  red,
  yellow,
  grey,
  black,
  bgBlue,
  dim,
} from "kleur/colors";

import type { RouteAssets, RouteEndpoint } from "./@types";
import store from "./store";

type Printer = (line: string) => void;

export function debug(printer: Printer = console.log) {
  const lines: string[] = store.debug.splice(0, store.debug.length);

  for (const line of lines) {
    printer?.(line);
  }

  return lines;
}

export function warnings(printer: Printer = console.warn) {
  const lines = store.warnings
    .splice(0, store.warnings.length)
    .map((lines) => ["", ...lines.map((line) => `  ${line}  `)].join("\n"));

  for (const line of lines) {
    printer?.(line);
  }

  return lines;
}

const dot = "·";

function colorizeMethod(method: string): string {
  const color = {
    GET: green,
    POST: blue,
    PATCH: blue,
    PUT: blue,
    DELETE: red,
  }[method];

  return color?.(method) || method;
}

export function pushRouteEndpoints(
  assets: RouteAssets,
  endpoints: RouteEndpoint[],
) {
  const { path, file } = assets;
  const lines: string[] = ["\n"];

  lines.push(
    [`[ ${bgBlue(black(` ${path} `))} ]`, grey(` { file: ${file} }`)].join(""),
  );

  const paramsMaxlength = Math.max(
    3,
    ...endpoints.map((e) => e.params?.length || 0),
  );

  for (const { params, method, middleware } of endpoints) {
    const stackLengthText = ` (stack size: ${middleware.length}) `;

    const coloredMethod = colorizeMethod(method);

    const methodText =
      method === "GET"
        ? `  ${coloredMethod}${grey("|HEAD")}`
        : `  ${coloredMethod}`;

    const spacesCount = method === "GET" ? 6 : 14 - method.length;

    const spaces = Array(spacesCount).fill(" ").join("");

    const dotsCount =
      process.stdout.columns -
      16 -
      paramsMaxlength -
      stackLengthText.length -
      4;

    const dots = dotsCount > 0 ? Array(dotsCount).fill(dot).join("") : 0;

    lines.push(
      [
        methodText,
        spaces,
        padEnd(params, paramsMaxlength, dim(grey(dot)), yellow),
        grey(stackLengthText),
        dim(grey(dots)),
      ].join(""),
    );
  }

  store.debug.push(...lines);
}

function padEnd(
  str: string,
  maxlength: number,
  fill: string,
  decorate?: (s: string) => string,
): string {
  const suffixLength = maxlength - str.length;

  const suffix =
    suffixLength > 0 ? Array(suffixLength).fill(fill).join("") : "";

  return decorate ? decorate(str) + suffix : str + suffix;
}
