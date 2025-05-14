import { Model } from "@/models/utils/types";
import { Database } from "@/types/db";
import { PgColumn } from "drizzle-orm/pg-core";
import { ErrorPayload } from "@/types/resources";

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
  & CRUDAccessor
  & Record<string, any>
);

export type CRUDAccessor = (
  & CreateOperation
  & ReadOperation
  & ReadAllOperation
  & UpdateOperation
  & DeleteOperation
);

/******************************************************************************
 * Helper types
 *****************************************************************************/

export type ParsedPayload = {
  success: true;
  result: Record<string, any>;
} | {
  success: false;
  errors: ErrorPayload;
};

export type ValidatedPayload = { 
  success: true 
} | {
  success: false;
  errors: ErrorPayload;
} 

export type ResultPayload<
  Result extends Record<string, any>,
> = {
  success: true;
  result: Result;
} | {
  success: false;
  errors: ErrorPayload;
};

export type LookUpValue = string;

/******************************************************************************
 * CRUD types
 *****************************************************************************/

export type LookUpMixin = {
  getLookupColumn: () => PgColumn;
  parseLookupValue: (
    lookupValue: LookUpValue
  ) => any;
}

export type CreateOperation<
  Input extends Record<string, any> = Record<string, any>,
  Result extends Record<string, any> = Record<string, any>,
> = {
  validateCreateInput: (
    data: Input
  ) => Promise<ValidatedPayload>;
  parseCreateInput: (
    data: Input
  ) => Promise<ParsedPayload>;
  commitCreate: (
    data: Input
  ) => Promise<ResultPayload<Result>>;
  create: (
    data: Input
  ) => Promise<ResultPayload<Result>>;
};

export type ReadOperation<
  Result extends Record<string, any> = Record<string, any>,
> = LookUpMixin & {
  commitRead: (
    lookupValue: LookUpValue
  ) => Promise<ResultPayload<Result>>;
  read: (
    lookupValue: LookUpValue
  ) => Promise<ResultPayload<Result>>;
};

export type ReadAllOperation<
  Input extends Record<string, any> = Record<string, any>,
  Result extends Record<string, any> = Record<string, any>,
> = {
  validateReadAllParameters: (
    data: Input
  ) => Promise<ValidatedPayload>;
  parseReadAllParameters: (
    data: Input
  ) => Promise<ParsedPayload>;
  commitReadAll: (
    data: Input
  ) => Promise<ResultPayload<Result>>;
  readAll: (
    data: Input
  ) => Promise<ResultPayload<Result>>;
};

export type UpdateOperation<
  Input extends Record<string, any> = Record<string, any>,
  Result extends Record<string, any> = Record<string, any>,
> = LookUpMixin & {
  parseUpdateInput: (
    data: Input
  ) => Promise<ParsedPayload>;
  validateUpdateInput: (
    data: Input
  ) => Promise<ValidatedPayload>;
  commitUpdate: (
    lookupValue: LookUpValue,
    data: Input,
  ) => Promise<ResultPayload<Result>>;
  update: (
    lookupValue: LookUpValue,
    data: Input,
  ) => Promise<ResultPayload<Result>>;
};

export type DeleteOperation<
  Result extends Record<string, any> = Record<string, any>,
> = LookUpMixin & {
  commitDelete: (
    lookupValue: LookUpValue
  ) => Promise<ResultPayload<Result>>;
  delete: (
    lookupValue: LookUpValue
  ) => Promise<ResultPayload<Result>>;
};