import { ModelAccessor, AccessorValidationPayload, AccessorPayload } from "@/accessors/utils/types";
import { ReadOperation, ReadAllOperation } from "@/types/_resources";

export function withRead<
  Source extends ModelAccessor,
> (
  source: Source,
) {
  return {
    ...source,
    async validateRead (data) {
      // TODO: Implement validation
      return { success: true, errors: [] };
    },
    async commitRead (data) {
      const { id, key, ...insertData } = data;
      try {
        // TODO: Implement read
        const returned = {};
        return { success: true, result: returned, errors: [] };
      } catch (e) {
        console.error(e);
        return { success: false, result: null, errors: [e] };
      }
    },
    async read(data) {
      const validation = await this.validateRead(data);
      if (!validation.success) {
        return { success: false, result: null, errors: validation.errors };
      }
      return this.commitRead(data);
    },
  } as Source & ReadOperation<
    Record<string, any>,
    AccessorValidationPayload, 
    AccessorPayload<Record<string, any>>
  >;
};

export function withReadAll<
  Source extends ModelAccessor,
> (
  source: Source,
) {
  return {
   ...source,
    async validateReadAll (data) {
      // TODO: Implement validation
      return { success: true, errors: [] };
    },
    async commitReadAll (data) {
      const { id, key,...insertData } = data;
      try {
        // TODO: Implement read
        const returned = {} ;
        return { success: true, result: returned, errors: [] };
      } catch (e) {
        console.error(e);
        return { success: false, result: null, errors: [e] };
      }
    },
    async readAll(data) {
      const validation = await this.validateReadAll(data);
      if (!validation.success) {
        return { success: false, result: null, errors: validation.errors };
      }
      return this.commitReadAll(data);
    }
  } as Source & ReadAllOperation<
    Record<string, any>,
    AccessorValidationPayload, 
    AccessorPayload<Record<string, any>>
  >;
};