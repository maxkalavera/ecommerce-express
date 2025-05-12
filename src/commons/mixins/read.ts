import { ReadOperation, ReadAllOperation } from "@/types/_resources";

export function withRead<
  Source extends Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    getLookUpAttribute () {
      return "id";
    },
    async validateRead (data) {
      // TODO: Implement validation
      return { success: true, errors: [] };
    },
    async commitRead (data) {
      try {
        // TODO: Implement read
        return { success: true, result: {}, errors: [] };
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
    Record<string, any>
  >;
};

export function withReadAll<
  Source extends Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    async validateReadAll (data) {
      throw new Error("Not implemented");
    },
    async commitReadAll (data) {
      throw new Error("Not implemented");
    },
    async readAll(data) {
      throw new Error("Not implemented");
    }
  } as Source & ReadAllOperation<
    Record<string, any>,
    Record<string, any>
  >;
};