
import { CreateTarget } from "@/accessors/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { ModelAccessorStructure } from "@/accessors/utils/types";
import { AccessorError } from "@/utils/errors";
import { Value } from "@sinclair/typebox/value";
import { withCRUDCore } from "./crud";

export const withCreate: Mixin<ModelAccessorStructure, CreateTarget> = (
  source
) => {
  return {
    ...source,
    ...withCRUDCore(source),
    async validateCreateInput (data) {
      const input = { ...data };
      const validate = this.validate.insert;
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
    async commitCreate (data) {
      try {
        const result = await this.db
          .insert(this.model.table)
          .values(data)
          .returning();
        const parsed = Value.Parse(this.model.schemas.select, result) as Record<string, any>[];
        return { success: true, result: parsed[0], errors: [] };
      } catch (e) {
        console.error(e);
        return {
          success: false, 
          result: null, 
          errors: [new AccessorError("An error occurred while creating record")]
        };
      }
    },
    async create(data) {
      const validated = await this.validateCreateInput(data = {});
      if (!validated.success) {
        return { success: false, result: null, errors: validated.errors };
      }
      return this.commitCreate(validated.coerced);
    },
  };
}
