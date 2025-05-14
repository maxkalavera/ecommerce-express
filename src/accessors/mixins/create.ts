
import { CreateOperation } from "@/accessors/utils/types";
import { ModelAccessorStructure } from "@/accessors/utils/types";
import { Value } from "@sinclair/typebox/value";

export function withCreate<
  Source extends ModelAccessorStructure,
> (
  source: Source,
) {
  return {
    ...source,
    async validateCreateInput (data) {
      const errors = Array.from(Value.Errors(this.model.schemas.insert, data));
      if (errors.length > 0) {
        return { success: false, errors: errors };
      }
      return { success: true };
    },
    async parseCreateInput (data) {
      const validation = await this.validateCreateInput(data);
      if (!validation.success) {
        return { success: false, errors: validation.errors };
      }

      const parsed = Value.Parse(this.model.schemas.insert, data) as Record<string, any>;
      return { success: true, result: parsed};
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
          errors: ["An error occurred while creating record"]
        };
      }
    },
    async create(data) {
      const parsed = await this.parseCreateInput(data);
      if (!parsed.success) {
        return { success: false, result: null, errors: parsed.errors };
      }
      return this.commitCreate(parsed.result);
    },
  } as Source & CreateOperation;
};