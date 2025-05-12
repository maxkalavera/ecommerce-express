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

export type AccessorResultPayload<
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

export type CRUDAccessor = (
  & CreateOperation<
    Record<string, any>,
    Record<string, any>
  >
  & ReadOperation<
    Record<string, any>,
    Record<string, any>
  >
  & ReadAllOperation<
    Record<string, any>,
    Record<string, any>
  >
  & UpdateOperation<
    Record<string, any>,
    Record<string, any>
  >
  & DeleteOperation<
    Record<string, any>,
    Record<string, any>
  >
);

/******************************************************************************
 * CRUD types
 *****************************************************************************/

export type CreateOperation<
  InputPayload extends Record<string, any>,
  ResultPayload extends Record<string, any>,
> = {
  validateCreate: (
    data: InputPayload
  ) => Promise<AccessorValidationPayload>;
  commitCreate: (
    data: InputPayload
  ) => Promise<AccessorResultPayload<ResultPayload>>;
  create: (
    data: InputPayload
  ) => Promise<AccessorResultPayload<ResultPayload>>;
};

export type ReadOperation<
  InputPayload extends Record<string, any>,
  ResultPayload extends Record<string, any>,
> = {
  getLookUpAttribute: () => string;
  validateRead: (
    data: InputPayload
  ) => Promise<AccessorValidationPayload>;
  commitRead: (
    data: InputPayload
  ) => Promise<AccessorResultPayload<ResultPayload>>;
  read: (
    data: InputPayload
  ) => Promise<AccessorResultPayload<ResultPayload>>;
};

export type ReadAllOperation<
  InputPayload extends Record<string, any>,
  ResultPayload extends Record<string, any>,
> = {
  validateReadAll: (
    data: InputPayload
  ) => Promise<AccessorValidationPayload>;
  commitReadAll: (
    data: InputPayload
  ) => Promise<AccessorResultPayload<ResultPayload>>;
  readAll: (
    data: InputPayload
  ) => Promise<AccessorResultPayload<ResultPayload>>;
};

export type UpdateOperation<
  InputPayload extends Record<string, any>,
  ResultPayload extends Record<string, any>,
> = {
  getLookUpAttribute: () => string;
  validateUpdate: (
    data: InputPayload
  ) => Promise<AccessorValidationPayload>;
  commitUpdate: (
    data: InputPayload
  ) => Promise<AccessorResultPayload<ResultPayload>>;
  update: (
    data: InputPayload
  ) => Promise<AccessorResultPayload<ResultPayload>>;
};

export type DeleteOperation<
  InputPayload extends Record<string, any>,
  ResultPayload extends Record<string, any>,
> = {
  getLookUpAttribute: () => string;
  validateDelete: (
    data: InputPayload
  ) => Promise<AccessorValidationPayload>;
  commitDelete: (
    data: InputPayload
  ) => Promise<AccessorResultPayload<ResultPayload>>;
  delete: (
    data: InputPayload
  ) => Promise<AccessorResultPayload<ResultPayload>>;
};