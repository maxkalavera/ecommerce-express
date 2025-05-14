import { DeleteOperation } from "@/accessors/utils/types";
import { ModelAccessorStructure } from "@/accessors/utils/types";
import { withLookup } from "@/accessors/mixins/lookUp";
import { Value } from "@sinclair/typebox/value";
import { eq } from "drizzle-orm";

export function withDelete<
  Source extends ModelAccessorStructure,
> (
  source: Source,
): Source & DeleteOperation
{
  return {
    ...source,
    ...withLookup(source),
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
          errors: ["An error occurred while deleting record"]
        };
      }
    },
    async delete(lookupValue) {
      return this.commitDelete(lookupValue);
    }
  };
};