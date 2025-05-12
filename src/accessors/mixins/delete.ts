import { ModelAccessor, AccessorValidationPayload, AccessorPayload } from "@/accessors/utils/types";
import { DeleteOperation } from "@/types/_resources";

export function withDelete<
  Source extends ModelAccessor,
> (
  source: Source,
) {
  return {
  ...source,
    async validateDelete (data) {
      // TODO: Implement validation
      return { success: true, errors: [] };
    },
    async commitDelete (data) {
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
    async delete(data) {
      const validation = await this.validateDelete(data);
      if (!validation.success) {
        return { success: false, result: null, errors: validation.errors };
      }
      return this.commitDelete(data);
    }
  } as Source & DeleteOperation<
    Record<string, any>,
    AccessorValidationPayload,
    AccessorPayload<Record<string, any>>
  >;
};