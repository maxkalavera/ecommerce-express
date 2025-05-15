import { AccessorServiceStructure } from "@/services/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { DeleteTarget } from "@/services/utils/types";

export const withDelete: Mixin<AccessorServiceStructure, DeleteTarget> = (
  source
) => {
  return {
    ...source,
    async commitDelete (lookupValue) {
      return this.accessor.delete(lookupValue);
    },
    async delete(lookupValue) {
      return this.delete(lookupValue);
    },
  };
};