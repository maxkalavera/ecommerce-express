import { UpdateOperation } from "@/types/_resources";

export function withUpdate<
  Source extends Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    getLookUpAttribute () {
      return "id";
    },
    async validateUpdate (data) {
      throw new Error("Not implemented");
    },
    async commitUpdate (data) {
      throw new Error("Not implemented");
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
    Record<string, any>
  >;
};