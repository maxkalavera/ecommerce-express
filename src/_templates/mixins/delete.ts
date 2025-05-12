import { DeleteOperation } from "@/types/_resources";
import { withDelete as _withDelete } from "@/commons/mixins/delete";

export function withDelete<
  Source extends Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    ..._withDelete(source),
    async validateDelete (data) {
      throw new Error("Not implemented");
    },
    async commitDelete (data) {
      throw new Error("Not implemented");
    },
  } as Source & DeleteOperation<
    Record<string, any>,
    Record<string, any>
  >
};