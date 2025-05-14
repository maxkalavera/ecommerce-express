import { ModelAccessorStructure } from "@/accessors/utils/types";
import { withCreate } from "@/accessors/mixins/create";
import { withRead, withReadAll } from "@/accessors/mixins/read";
import { withUpdate } from "@/accessors/mixins/update";
import { withDelete } from "@/accessors/mixins/delete";

export function withCRUD<
  Source extends ModelAccessorStructure
> (
  source: Source,
) {
  return {
    ...source,
    ...withCreate(source),
    ...withRead(source),
    ...withReadAll(source),
    ...withUpdate(source),
    ...withDelete(source),
  };
};

