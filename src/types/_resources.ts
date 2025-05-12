
export type CreateOperation<
  InputPayload extends Record<string, any>,
  ResultPayload extends Record<string, any>,
> = {
  validateCreate: (
    data: InputPayload
  ) => Promise<CRUDValidationPayload>;
  commitCreate: (
    data: InputPayload
  ) => Promise<ResultPayload>;
  create: (
    data: InputPayload
  ) => Promise<ResultPayload>;
};

export type ReadOperation<
  InputPayload extends Record<string, any>,
  ResultPayload extends Record<string, any>,
> = {
  getLookUpAttribute: () => string;
  validateRead: (
    data: InputPayload
  ) => Promise<CRUDValidationPayload>;
  commitRead: (
    data: InputPayload
  ) => Promise<ResultPayload>;
  read: (
    data: InputPayload
  ) => Promise<ResultPayload>;
};

export type ReadAllOperation<
  InputPayload extends Record<string, any>,
  ResultPayload extends Record<string, any>,
> = {
  validateReadAll: (
    data: InputPayload
  ) => Promise<CRUDValidationPayload>;
  commitReadAll: (
    data: InputPayload
  ) => Promise<ResultPayload>;
  readAll: (
    data: InputPayload
  ) => Promise<ResultPayload>;
};

export type UpdateOperation<
  InputPayload extends Record<string, any>,
  ResultPayload extends Record<string, any>,
> = {
  getLookUpAttribute: () => string;
  validateUpdate: (
    data: InputPayload
  ) => Promise<CRUDValidationPayload>;
  commitUpdate: (
    data: InputPayload
  ) => Promise<ResultPayload>;
  update: (
    data: InputPayload
  ) => Promise<ResultPayload>;
};

export type DeleteOperation<
  InputPayload extends Record<string, any>,
  ResultPayload extends Record<string, any>,
> = {
  getLookUpAttribute: () => string;
  validateDelete: (
    data: InputPayload
  ) => Promise<CRUDValidationPayload>;
  commitDelete: (
    data: InputPayload
  ) => Promise<ResultPayload>;
  delete: (
    data: InputPayload
  ) => Promise<ResultPayload>;
};

export type CRUDResource = (
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

export type CRUDValidationPayload = {
  success: boolean;
  errors: string[];
};

export type CRUDResultPayload<
  Result extends Record<string, any>,
> = {
  success: true;
  result: Result;
  errors: Error[];  
} | {
  success: false;
  result: null;
  errors: Error[];
};