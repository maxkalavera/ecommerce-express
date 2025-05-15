import { buildTarget } from "@/utils/patterns/nomads";
import { AccessorServiceStructure } from "@/services/utils/types";

export const buildService = buildTarget;

export function buildAccessorService<
  Source extends Structure,
  Structure extends Record<string, any> = AccessorServiceStructure,
> (source: Source) {
return buildTarget<Source, Structure>(source);
}