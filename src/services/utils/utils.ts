import { buildTarget } from "@/utils/patterns/nomads";
import { AccessorService } from "@/services/utils/types";

export const buildService = buildTarget;

export function buildAccessorService<
  Source extends Structure,
  Structure extends Record<string, any> = AccessorService,
> (source: Source) {
return buildTarget<Source, Structure>(source);
}