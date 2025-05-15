import { AccessorServiceStructure } from "@/services/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { ReadTarget, ReadAllTarget } from "@/services/utils/types";

export const withRead: Mixin<AccessorServiceStructure, ReadTarget> = (
  source
) => {
  return {
    ...source,
    async commitRead (lookupValue) {
      return this.accessor.read(lookupValue);
    },
    async read(lookupValue) {
      return this.commitRead(lookupValue);
    },
  };
};

export const withReadAll: Mixin<AccessorServiceStructure, ReadAllTarget> = (
  source
) => {
  return {
    ...source,
    async commitReadAll (data) {
      return this.accessor.readAll(data);
    },
    async readAll(data = {}) {
      return this.commitReadAll(data);
    },
  };
};