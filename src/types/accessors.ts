import { LayersReturnType } from "@/types/commons";
import { PayloadSingle, PayloadMany } from "@/types/commons";

export type AccessorReturnType<
  Payload extends PayloadSingle<Instance> | PayloadMany<Instance> = PayloadSingle<any> | PayloadMany<any>,
  Instance extends Record<string, any> = any,
> = LayersReturnType<Payload>;