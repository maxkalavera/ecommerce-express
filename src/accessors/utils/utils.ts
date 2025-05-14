import { buildTarget } from "@/utils/patterns/nomads";
import type { AccessorStructure, ModelAccessorStructure } from "@/accessors/utils/types";

export function buildAccessor<
  Source extends Structure,
  Structure extends Record<string, any> = AccessorStructure,
> (source: Source) {
return buildTarget<Source, Structure>(source);
}

export function buildModelAccessor<
  Source extends Structure,
  Structure extends Record<string, any> = ModelAccessorStructure,
> (source: Source) {
return buildTarget<Source, Structure>(source);
}