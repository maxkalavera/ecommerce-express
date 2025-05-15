import { AccessorServiceStructure } from "@/services/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { CreateTarget } from "@/services/utils/types";

export const withCreate: Mixin<AccessorServiceStructure, CreateTarget> = (
  source
) => {
  return {
    ...source,
    async commitCreate (data) {
      return await source.accessor.create(data);
    },
    async create (data = {}) {
      return this.commitCreate(data);
    }
  };
};