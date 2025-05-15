import { UpdateTarget } from "@/accessors/utils/types";
import { withLookup } from "@/accessors/mixins/lookup";
import { ModelAccessorStructure } from "@/accessors/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { Value } from "@sinclair/typebox/value";
import { eq } from "drizzle-orm";
import { APIError } from "@/utils/errors";

export const withUpdate: Mixin<ModelAccessorStructure, UpdateTarget> = (
  source
) => {
  return {
    ...source,
    ...withLookup(source),
    async validateUpdateInput (data) {
      const errors = APIError.fromTypeBoxErrors(
        Value.Errors(this.model.schemas.update, data));
      if (errors.length > 0) {
        return { success: false, errors: errors };
      }
      return { success: true };
    },
    async parseUpdateInput (data) {
      const validation = await this.validateUpdateInput(data);
      if (!validation.success) {
        return { success: false, errors: validation.errors };
      }
      const parsed = Value.Parse(this.model.schemas.update, data) as Record<string, any>;
      
      return { success: true, result: parsed };
    },
    async commitUpdate (lookupValue, data) {
      try {
        const result = await this.db
          .update(this.model.table)
          .set(data)
          .where(eq(this.getLookupColumn(), this.parseLookupValue(lookupValue)))
          .returning();
        const parsed = Value.Parse(this.model.schemas.select, result) as Record<string, any>;
        return { success: true, result: parsed[0], errors: [] };
      } catch (e) {
        console.error(e);
        return {
          success: false, 
          result: null, 
          errors: [new APIError("An error occurred while updating record")]
        };
      }
    },
    async update(lookupValue, data = {}) {
      const parsed = await this.parseUpdateInput(data);
      if (!parsed.success) {
        return { success: false, result: null, errors: parsed.errors };
      }
      return this.commitUpdate(lookupValue, parsed.result);
    }
  };
};