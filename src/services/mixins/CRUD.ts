import { AccessorServiceStructure, CRUDService } from "@/services/utils/types";
import { Mixin } from "@/utils/patterns/nomads";
import { withCreate } from "./create";
import { withRead, withReadAll } from "./read";
import { withUpdate } from "./update";
import { withDelete } from "./delete";

export const withCRUD: Mixin<AccessorServiceStructure, CRUDService> = (
  source
) => {
  return {
   ...source,
   ...withCreate(source),
   ...withRead(source),
   ...withReadAll(source),
   ...withUpdate(source),
   ...withDelete(source),
  };
};

