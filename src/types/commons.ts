import { APIError } from "@/utils/errors";

export type ReturnSingle<
  Instance extends Record<string, any>
> = {
  data: Instance;
}

export type ReturnMany<
  Instance extends Record<string, any>
> = {
  items: Instance[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type LayersReturnType<
  Instance extends Record<string, any>,
> = (
  {
    success: true,
    payload: ReturnSingle<Instance> | ReturnMany<Instance>,
  } | {
    success: false,
    error: APIError,
  }
);

export type OperationReturnType<
  Data extends any = Record<string, any>,
> = (
  {
    success: true,
    data: Data,
  } | {
    success: false,
    error: APIError,
  }
);

export type InputData = Record<string, any>;

export type LookupIdentifiers = Record<string, any>;