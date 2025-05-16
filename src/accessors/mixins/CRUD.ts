import settings from "@/settings";
import { ModelAccessorStructure, CRUDAccessorTarget, CRUDCoreTarget } from "@/accessors/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { withCreate } from "./create";
import { withRead, withReadAll } from "./read";
import { withUpdate } from "./update";
import { withDelete } from "./delete";
import { Value } from "@sinclair/typebox/value";

export const withCRUDCore: Mixin<ModelAccessorStructure, CRUDCoreTarget> = (
  source
) => {
  return {
    ...source,
    getLookupColumn () {
      const column = this.model.table[
        settings.QUERIES_LOOK_UP_ATTRIBUTE as keyof typeof this.model.table];
      if (column !== undefined) {
        return column as any;
      }
      throw new Error("Lookup column not found");
    },
    parseLookupValue (lookup) {
      return lookup;
    },
    parseReturned (input) {
      return input.map(item => 
        Value.Parse(this.model.schemas.select, item) as Record<string, any>
      );
    }
  };
}

export const withCRUD: Mixin<ModelAccessorStructure, CRUDAccessorTarget> = (
  source
) => {
  return {
   ...source,
   ...withCreate(source),
   ...withRead(source),
   ...withReadAll(source),
   ...withUpdate(source),
   ...withDelete(source),
  };
};

