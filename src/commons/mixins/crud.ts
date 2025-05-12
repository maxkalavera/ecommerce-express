
import { CRUDResource } from "@/types/_resources";
import { withCreate } from "./create";
import { withRead, withReadAll } from "./read";
import { withUpdate } from "./update";
import { withDelete } from "./delete";

export function withCRUD<
  Source extends Record<string, any>
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
  } as Source & CRUDResource;
};

