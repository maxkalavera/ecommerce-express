import settings from "@/settings";
import { ajv } from "@/utils/validator";
import { ModelAccessorStructure, CRUDAccessorTarget, CRUDCoreTarget } from "@/accessors/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { withCreate } from "./create";
import { withRead, withReadAll } from "./read";
import { withUpdate } from "./update";
import { withDelete } from "./delete";

export const withCRUDCore: Mixin<ModelAccessorStructure, CRUDCoreTarget> = (
  source
) => {
  return {
    ...source,
    validate: {
      select: ajv.compile(source.model.schemas.select),
      insert: ajv.compile(source.model.schemas.insert),
      update: ajv.compile(source.model.schemas.update),
    },
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
    coerceReturned (input) {
      const copied = input.slice();
      return copied.map(item => {
        const isValid = this.validate.select(item);
        if (!isValid) {
          throw new Error("Invalid returned value");
        }
        return item;
      });
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

