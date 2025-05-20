import { DeleteTarget } from "@/accessors/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { ModelAccessorStructure } from "@/accessors/utils/types";
import { Value } from "@sinclair/typebox/value";
import { eq } from "drizzle-orm";
import { AccessorError } from "@/utils/errors";
import { withCRUDCore } from "./crud";

export const withDelete: Mixin<ModelAccessorStructure, DeleteTarget> = (
  source
) => {
  return {
    ...source,
    ...withCRUDCore(source),
    async commitDelete (lookupValue) {
      try {
        const result = await this.db
          .delete(this.model.table)
          .where(eq(this.getLookupColumn(), this.parseLookupValue(lookupValue)))
          .returning();
        const parsed = Value.Parse(this.model.schemas.select, result) as Record<string, any>;
        return {
          success: true,
          result: parsed[0],
        }
      } catch (e) {
        console.error(e);
        return {
          success: false,
          errors: [new AccessorError("An error occurred while deleting record")]
        };
      }
    },
    async delete(lookupValue) {
      return this.commitDelete(lookupValue);
    }
  };
};