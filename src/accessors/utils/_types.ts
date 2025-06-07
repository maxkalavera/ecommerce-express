import { LayersReturnType } from "@/types/commons";

export type AccessorReturnType<
Instance extends Record<string, any>
> = LayersReturnType<Instance>;