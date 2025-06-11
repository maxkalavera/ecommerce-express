import { APIError } from "@/utils/errors";

export type PayloadSingle<
  Instance extends Record<string, any>
> = {
  data: Instance;
}

export type PayloadMany<
  Instance extends Record<string, any>
> = {
  items: Instance[];
  cursor: string | null;
  hasMore: boolean;
}

export type LayersReturnType<
  Payload extends PayloadSingle<Instance> | PayloadMany<Instance> = PayloadSingle<any> | PayloadMany<any>,
  Instance extends Record<string, any> = any,
> = (
  {
    success: true,
    payload: Payload,
  } | {
    success: false,
    error: APIError,
  }
);
