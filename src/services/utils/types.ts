import { Accessor } from "@/accessors/utils/types";

/******************************************************************************
 * Accessor types
 *****************************************************************************/

export type Service = {
  [key: string]: any;
};

export type AccessorService = Service & {
  accessor: Accessor;
};

/******************************************************************************
 * Helper types
 *****************************************************************************/

export type ServicePayload<
  Result extends Record<string, any>,
> = {
  success: true;
  result: Result;
  errors: string[];  
} | {
  success: false;
  result: null;
  errors: string[];
};
