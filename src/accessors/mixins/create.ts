
import { ModelAccessor, AccessorValidationPayload, AccessorPayload } from "@/accessors/utils/types";
import { CreateOperation } from "@/types/_resources";


export function withCreate<
  Source extends ModelAccessor,
> (
  source: Source,
) {
  return {
    ...source,
    async validateCreate (data) {
      // TODO: Implement validation
      return { success: true, errors: [] };
    },
    async commitCreate (data) {
      const { id, key, ...insertData } = data;
      try {
        const returned = await this.db.insert(this.table)
        .values(insertData)
        .returning();
        return { success: true, result: returned[0], errors: [] };
      } catch (e) {
        console.error(e);
        return { success: false, result: null, errors: [e] };
      }
    },
    async create(data) {
      const validation = await this.validateCreate(data);
      if (!validation.success) {
        return { success: false, result: null, errors: validation.errors };
      }
      return this.commitCreate(data);
    },
  } as Source & CreateOperation<
    Record<string, any>,
    AccessorValidationPayload, 
    AccessorPayload<Record<string, any>>
  >;
};