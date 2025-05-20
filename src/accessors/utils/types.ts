import { Model } from "@/models/utils/types";
import { Database } from "@/types/db";
import { PgColumn } from "drizzle-orm/pg-core";
import { AccessorError } from "@/utils/errors";
import { MergeObjectsList } from "@/utils/patterns/nomads";
import { ValidateFunction } from "ajv";

/******************************************************************************
 * Accessor types
 *****************************************************************************/

export type AccessorStructure = {
  db: Database;
};

export type ModelAccessorStructure = AccessorStructure & {
  model: Model;
};

export type ModelAccessor = (
  & ModelAccessorStructure
  & CRUDAccessorTarget
);

export type CRUDAccessorTarget = MergeObjectsList<[
  CreateTarget,
  ReadTarget,
  ReadAllTarget,
  UpdateTarget,
  DeleteTarget,
]>;

/******************************************************************************
 * Helper types
 *****************************************************************************/

/*
export type ParsedPayload = {
  success: true;
  result: Record<string, any>;
} | {
  success: false;
  errors: AccessorError[];
};
*/

export type ValidatedPayload = { 
  success: true,
  coerced: Record<string, any>; // coerced value
} | {
  success: false;
  errors: AccessorError[];
} 

export type ResultPayload<
  Result extends Record<string, any>,
> = {
  success: true;
  result: Result;
} | {
  success: false;
  errors: AccessorError[];
};

/******************************************************************************
 * CRUD types
 *****************************************************************************/


export type CRUDCoreTarget = {
  validate: {
    select: ValidateFunction,
    insert: ValidateFunction,
    update: ValidateFunction,
  }
  getLookupColumn: () => PgColumn;
  parseLookupValue: (
    lookupValue: string
  ) => any;
  coerceReturned: (
    input: Record<string, any>[]
  ) => Record<string, any>[];
};

export type LookupTarget = {
  getLookupColumn: () => PgColumn;
  parseLookupValue: (
    lookupValue: string
  ) => any;
}


export type CreateTarget<
  Input extends Record<string, any> = Record<string, any>,
  Result extends Record<string, any> = Record<string, any>,
> = MergeObjectsList<[
  CRUDCoreTarget,
  {
    validateCreateInput: (
      data: Input
    ) => Promise<ValidatedPayload>;
    commitCreate: (
      data: Input
    ) => Promise<ResultPayload<Result>>;
    create: (
      data?: Input
    ) => Promise<ResultPayload<Result>>;
  }
]>;

export type ReadTarget<
  Result extends Record<string, any> = Record<string, any>,
> = MergeObjectsList<[
  CRUDCoreTarget, 
  {
    commitRead: (
      lookupValue: string
    ) => Promise<ResultPayload<Result>>;
    read: (
      lookupValue: string
    ) => Promise<ResultPayload<Result>>;
  }
]>;

export type ReadAllTarget<
  Input extends Record<string, any> = Record<string, any>,
  Result extends Record<string, any> = Record<string, any>,
> = MergeObjectsList<[
  CRUDCoreTarget,
  {
    validateReadAllParameters: (
      query: Input
    ) => Promise<ValidatedPayload>;
    commitReadAll: (
      query: Input
    ) => Promise<ResultPayload<Result>>;
    readAll: (
      query?: Input
    ) => Promise<ResultPayload<Result>>;
  }
]>;

export type UpdateTarget<
  Input extends Record<string, any> = Record<string, any>,
  Result extends Record<string, any> = Record<string, any>,
> = MergeObjectsList<[
  CRUDCoreTarget, 
  {
    validateUpdateInput: (
      data: Input
    ) => Promise<ValidatedPayload>;
    commitUpdate: (
      lookupValue: string,
      data: Input,
    ) => Promise<ResultPayload<Result>>;
    update: (
      lookupValue: string,
      data?: Input,
    ) => Promise<ResultPayload<Result>>;
  }
]>;

export type DeleteTarget<
  Result extends Record<string, any> = Record<string, any>,
> = MergeObjectsList<[
  CRUDCoreTarget,
  {
    commitDelete: (
      lookupValue: string
    ) => Promise<ResultPayload<Result>>;
    delete: (
      lookupValue: string
    ) => Promise<ResultPayload<Result>>;
  }
]>;