import { ModelAccessor, AccessorValidationPayload, AccessorPayload } from "@/accessors/utils/types";
import { UpdateOperation } from "@/types/_resources";

export function withUpdate<
  Source extends ModelAccessor,
> (
  source: Source,
) {
  return {
   ...source,
    async validateUpdate (data) {
      // TODO: Implement validation
      return { success: true, errors: [] };
    },
    async commitUpdate (data) {
      const { id, key,...insertData } = data;
      try {
        // TODO: Implement read
        const returned = {};
        return { success: true, result: returned, errors: [] };
      } catch (e) {
        console.error(e);
        return { success: false, result: null, errors: [e] };
      }
    },
    async update(data) {
      const validation = await this.validateUpdate(data);
      if (!validation.success) {
        return { success: false, result: null, errors: validation.errors };
      }
      return this.commitUpdate(data);
    }
  } as Source & UpdateOperation<
    Record<string, any>,
    AccessorValidationPayload,
    AccessorPayload<Record<string, any>>
  >;
};