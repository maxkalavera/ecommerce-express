import { buildTarget } from "@/utils/patterns/nomads";
import type { ModelAccessor } from "@/accessors/utils/types";

export const buildAccessor = buildTarget;

export function buildModelAccessor<
  Source extends Structure,
  Structure extends Record<string, any> = ModelAccessor,
> (source: Source) {
return buildTarget<Source, Structure>(source);
}