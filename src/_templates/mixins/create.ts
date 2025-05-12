import { CreateOperation } from "@/types/_resources";
import { withCreate as _withCreate } from "@/commons/mixins/create";

export function withCreate<
  Source extends Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    ..._withCreate(source),
    async validateCreate (data) {
      throw new Error("Not implemented");
    },
    async commitCreate (data) {
      throw new Error("Not implemented");
    },
  } as Source & CreateOperation<
  Record<string, any>,
  Record<string, any>
>
};