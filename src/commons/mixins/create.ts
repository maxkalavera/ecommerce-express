
import { CreateOperation } from "@/types/_resources";

export function withCreate<
  Source extends Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    async validateCreate (data) {
      throw new Error("Not implemented");
    },
    async commitCreate (data) {
      throw new Error("Not implemented");
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
    Record<string, any>
  >;
};