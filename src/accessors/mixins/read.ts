import { ReadTarget, ReadAllTarget } from "@/accessors/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { ModelAccessorStructure } from "@/accessors/utils/types";
import { Value } from "@sinclair/typebox/value";
import { eq } from "drizzle-orm";
import { APIError } from "@/utils/errors";
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
          errors: [new APIError("An error occurred while fetching record")]
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
      return { success: true};
    },
    async parseReadAllParameters (query) {
      const validation = await this.validateReadAllParameters(query);
      if (!validation.success) {
        return { success: false, errors: validation.errors };
      }

      return { success: true, result: query };
    },
    async commitReadAll (query) {
      try {
        const result = await this.db.select().from(this.model.table);
        const parsed = this.parseReturned(result);
        return { success: true, result: parsed };
      } catch (e) {
        console.error(e);
        return { 
          success: false, 
          errors: [new APIError("An error occurred while fetching records")]
        };
      }
    },
    async readAll(query={}) {
      const parsed = await this.parseReadAllParameters(query);
      if (!parsed.success) {
        return { success: false, result: null, errors: parsed.errors };
      }
      return this.commitReadAll(parsed.result);
    }
  };
};