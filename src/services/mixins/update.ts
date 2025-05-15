import { AccessorServiceStructure } from "@/services/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { UpdateTarget } from "@/services/utils/types";

export const withUpdate: Mixin<AccessorServiceStructure, UpdateTarget> = (
  source
) => {
  return {
    ...source,
    async commitUpdate (lookupValue, data) {
      return this.accessor.update(lookupValue, data);
    },
    async update(lookupValue, data) {
      return this.update(lookupValue, data);
    },
  };
};