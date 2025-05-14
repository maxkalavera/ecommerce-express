import { AccessorStructure } from "@/accessors/utils/types";

/******************************************************************************
 * Accessor types
 *****************************************************************************/

export type Service = {
  [key: string]: any;
};

export type AccessorService = Service & {
  accessor: AccessorStructure;
};
