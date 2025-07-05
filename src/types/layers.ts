import { APIError } from "@/utils/errors";
import { LayersReturn as _LayersReturn } from "@/utils/layers/LayersReturn";


export type PayloadSingle<
  Instance extends Record<string, any>
> = {
  data: Instance;
};

export type PayloadMany<
  Instance extends Record<string, any>
> = {
  items: Instance[];
  cursor: string | null;
  hasMore: boolean;
};

export type ReturnData<
  Payload extends PayloadSingle<any> | PayloadMany<any> = PayloadSingle<any> | PayloadMany<any>,
> = (
  {
    success: true,
    payload: Payload,
  } | {
    success: false,
    error: APIError,
  }
);

export type LayersReturnType<
  Payload extends PayloadSingle<any> | PayloadMany<any> = PayloadSingle<any> | PayloadMany<any>,
> = _LayersReturn<Payload>;

export const ReturnSuccess: LayersReturnType = new _LayersReturn({ success: true, payload: {} as PayloadSingle<any> })
