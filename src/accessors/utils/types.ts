import { Model } from "@/models/utils/types";
import { Database } from "@/types/db";

/******************************************************************************
 * Accessor types
 *****************************************************************************/

export type Accessor = {
  db: Database;
  [key: string]: any;
};

export type ModelAccessor = Accessor & {
  model: Model;
};

/******************************************************************************
 * Helper types
 *****************************************************************************/

export type AccessorValidationPayload = {
  success: boolean;
  errors: string[];
};

export type AccessorPayload<
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
