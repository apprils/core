
import { green, blue, red, yellow, grey, black, bgBlue, dim } from "kleur/colors";

import type { RouteSpec } from "./@types";
import { _debug, _warnings } from "./store";

export function debug(printer?: Function) {

  const lines = _debug.splice(0, _debug.length)

  if (printer) {
    for (const line of lines) {
      printer(line)
    }
  }

  return lines

}

export function warnings(printer?: Function) {

  const lines = _warnings
    .splice(0, _warnings.length)
    .map((lines) => "\n" + lines.map((line) => `  ${ line }  `).join("\n"))

  if (printer) {
    for (const line of lines) {
      printer(line)
    }
  }

  return lines

}

const dot = "·"

function colorizeMethod(method: string): string {

  const color = {
    GET: green,
    POST: blue,
    PATCH: blue,
    PUT: blue,
    DELETE: red,
  }[method]

  return color?.(method) || method

}

export function pushRouteEntry(
  {
    name,
    path,
    file,
    spec,
  }: {
    name: string;
    path: string;
    file: string;
    spec: RouteSpec[];
  },
) {

  const lines: string[] = [ "\n" ]

  lines.push([
    `[ ${ bgBlue(black(` ${ path } `)) } ]`,
    grey(` { file: ${ file } }`),
  ].join(""))

  const paramsMaxlength = Math.max(3, ...spec.map((e) => e.params?.length || 0))

  for (const { params, method, middleware } of spec.filter((e) => !e.use.length)) {

    const stackLengthText = ` (stack size: ${ middleware.length }) `

    const coloredMethod = colorizeMethod(method)

    const methodText = method === "GET"
      ? `  ${ coloredMethod }${ grey("|HEAD") }`
      : `  ${ coloredMethod }`

    const spacesCount = method === "GET"
      ? 6
      : 14 - method.length

    const spaces = Array(spacesCount).fill(" ").join("");

    const dotsCount = process.stdout.columns
      - 16
      - paramsMaxlength
      - stackLengthText.length
      - 4

    const dots = dotsCount > 0
      ? Array(dotsCount).fill(dot).join("")
      : 0;

    lines.push([
      methodText,
      spaces,
      padEnd(params, paramsMaxlength, dim(grey(dot)), yellow),
      grey(stackLengthText),
      dim(grey(dots)),
    ].join(""))
  }

  _debug.push(...lines)

}

export function pushWarningEntry(lines: string[]) {

  _warnings.push([
    red("[ WARNING ]"),
    ...lines
  ])

}

function padEnd(
  str: string,
  maxlength: number,
  fill: string,
  decorate?: (s: string) => string,
): string {

  const suffixLength = maxlength - str.length

  const suffix = suffixLength > 0
    ? Array(suffixLength).fill(fill).join("")
    : ""

  return decorate
    ? decorate(str) + suffix
    : str + suffix

}

