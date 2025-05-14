import settings from "@/settings";
import { LookUpMixin } from "@/accessors/utils/types";
import { ModelAccessorStructure } from "@/accessors/utils/types";

/******************************************************************************
 * Mixins
 *****************************************************************************/

export function withLookup<
  Source extends ModelAccessorStructure,
> (
  source: Source,
) {
  return {
    ...source,
    getLookupColumn () {
      const column = this.model.table[
        settings.QUERIES_LOOK_UP_ATTRIBUTE as keyof typeof this.model.table];
      if (column !== undefined) {
        return column;
      }
      throw new Error("Lookup column not found");
    },
    parseLookupValue (lookup) {
      return lookup;
    }
  } as Source & LookUpMixin;
}