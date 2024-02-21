import type { UseDefinition, UseScopeGlobal } from "./@types";

const _useGlobal: UseDefinition<UseScopeGlobal>[] = [];
const _debug: string[] = [];
const _warnings: string[][] = [];

export default {
  useGlobal: _useGlobal,
  debug: _debug,
  warnings: _warnings,
};
