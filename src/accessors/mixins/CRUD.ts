import { ModelAccessor, AccessorValidationPayload, AccessorPayload } from "@/accessors/utils/types";
import { MergeObjects } from "@/utils/patterns/nomads";

/******************************************************************************
 * Types
 *****************************************************************************/

export type CRUDAccessor<
  InputData extends Record<string, any>,
  Result extends Record<string, any> = InputData,
> = {
  validateCreate: (
    data: InputData
  ) => Promise<AccessorValidationPayload>;
  commitCreate: (
    data: InputData
  ) => Promise<AccessorPayload<Result>>;
  create: (
    data: InputData
  ) => Promise<AccessorPayload<Result>>;
}

/******************************************************************************
 * Mixins
 *****************************************************************************/

export function withCRUD<
  Source extends ModelAccessor,
> (
  source: Source,
) {
  return {
    ...source,
    async validateCreate (data) {
      return {
        success: true,
        errors: [],
      };
    },
    async commitCreate (data) {
      const { id, key, ...insertData } = data;
      try {
        const returned = await this.db.insert(this.table)
        .values(insertData)
        .returning();
        return {
          success: true,
          result: returned[0],
          errors: [],
        };
      } catch (e) {
        console.error(e);
        return {
          success: false,
          result: null,
          errors: ["Error creating record in database"],
        };
      }

    },
    async create(data) {
      const validation = await this.validateCreate(data);
      if (!validation.success) {
        return {
          success: false,
          result: null,
          errors: validation.errors,
        };
      }
      return this.commitCreate(data);
    }
  } as MergeObjects<Source, CRUDAccessor<Record<string, any>>>;
};

