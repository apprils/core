import type { UseDefinition, UsePositionGlobal } from "./@types";

const _useGlobal: UseDefinition<UsePositionGlobal>[] = [];
const _debug: string[] = [];
const _warnings: string[][] = [];

export default {
  useGlobal: _useGlobal,
  debug: _debug,
  warnings: _warnings,
};
