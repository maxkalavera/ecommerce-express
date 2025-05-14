import { buildTarget } from "@/utils/patterns/nomads";
import { Controller, ServiceController } from "@/controllers/utils/types";

export function buildController<
  Source extends Structure,
  Structure extends Record<string, any> = Controller,
> (
  source: Source,
) {
  return buildTarget<Source, Structure>(source);
};

export function buildServiceController<
  Source extends Structure,
  Structure extends Record<string, any> = ServiceController,
> (
  source: Source,
) {
  return buildTarget<Source, Structure>(source);
}