import { UpdateTarget } from "@/accessors/utils/types";
import { ModelAccessorStructure } from "@/accessors/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { Value } from "@sinclair/typebox/value";
import { eq } from "drizzle-orm";
import { AccessorError } from "@/utils/errors";
import { withCRUDCore } from "./crud";

export const withUpdate: Mixin<ModelAccessorStructure, UpdateTarget> = (
  source
) => {
  return {
    ...source,
    ...withCRUDCore(source),
    async validateUpdateInput (data) {
      const input = { ...data };
      const validate = this.validate.update;
      const isValid = validate(input)
      const errors = validate.errors;
      if (!isValid) {
        return {
          success: false,
          errors: AccessorError.fromAjvErrors(errors || []),
        }
      }

      return {
        success: true,
        coerced: input,
      };
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
          errors: [new AccessorError("An error occurred while updating record")]
        };
      }
    },
    async update(lookupValue, data = {}) {
      const validated = await this.validateUpdateInput(data);
      if (!validated.success) {
        return { success: false, result: null, errors: validated.errors };
      }
      return this.commitUpdate(lookupValue, validated.coerced);
    }
  };
};