import { LayersReturnType } from "@/types/commons";

export type ServiceReturnType<
  Instance extends Record<string, any>
> = LayersReturnType<Instance>;