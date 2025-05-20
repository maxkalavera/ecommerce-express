import { ReadTarget, ReadAllTarget } from "@/accessors/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { ModelAccessorStructure } from "@/accessors/utils/types";
import { Value } from "@sinclair/typebox/value";
import { eq } from "drizzle-orm";
import { AccessorError } from "@/utils/errors";
import { withCRUDCore } from "./crud";

export const withRead: Mixin<ModelAccessorStructure, ReadTarget> = (
  source
) => {
  return {
    ...source,
    ...withCRUDCore(source),
    async commitRead (lookupValue) {
      try {
        const result = await this.db
          .select()
          .from(this.model.table)
          .where(eq(
            this.getLookupColumn(),
            this.parseLookupValue(lookupValue)
          ));
        const parsed = Value.Parse(this.model.schemas.select, result) as Record<string, any>[];
        return { success: true, result: parsed[0], errors: [] };
      } catch (e) {
        console.error(e);
        return {
          success: false, 
          result: null, 
          errors: [new AccessorError("An error occurred while fetching record")]
        };
      }
    },
    async read(data) {
      return this.commitRead(data);
    },
  };
};

export const withReadAll: Mixin<ModelAccessorStructure, ReadAllTarget> = (
  source
) => {
  return {
    ...source,
    ...withCRUDCore(source),
    async validateReadAllParameters (query) {
      return { success: true, coerced: query };
    },
    async commitReadAll (query) {
      try {
        const result = await this.db.select().from(this.model.table);
        const coerced = this.coerceReturned(result);
        return { success: true, result: coerced };
      } catch (e) {
        console.error(e);
        return { 
          success: false, 
          errors: [new AccessorError("An error occurred while fetching records")]
        };
      }
    },
    async readAll(query={}) {
      const validated = await this.validateReadAllParameters(query);
      if (!validated.success) {
        return { success: false, result: null, errors: validated.errors };
      }
      return this.commitReadAll(validated.coerced);
    }
  };
};