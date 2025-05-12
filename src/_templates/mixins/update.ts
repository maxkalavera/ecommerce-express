import { UpdateOperation } from "@/types/_resources";
import { withUpdate as _withUpdate } from "@/commons/mixins/update";

export function withUpdate<
  Source extends Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    ..._withUpdate(source),
    async validateUpdate (data) {
      throw new Error("Not implemented");
    },
    async commitUpdate (data) {
      throw new Error("Not implemented");
    },
  } as Source & UpdateOperation<
  Record<string, any>,
  Record<string, any>
>
};