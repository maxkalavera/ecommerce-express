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
  cursor: string | null;
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
