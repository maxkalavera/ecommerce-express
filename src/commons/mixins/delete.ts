import { DeleteOperation } from "@/types/_resources";

export function withDelete<
  Source extends Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    getLookUpAttribute () {
      return "id";
    },
    async validateDelete (data) {
      throw new Error("Not implemented");
    },
    async commitDelete (data) {
      throw new Error("Not implemented");
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
    Record<string, any>
  >;
};