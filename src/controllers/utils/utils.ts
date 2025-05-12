import { buildTarget } from "@/utils/patterns/nomads";
import { Controller, ServiceController } from "@/controllers/utils/types";

const defaultOptions: Controller["options"] = {
  lookUpAttribute: "id",
};

export function buildController<
  Source extends Structure,
  Structure extends Record<string, any> = Controller,
> (
  source: Omit<Source, "options"> & { options?: Partial<Controller["options"]> }
) {
  const options = Object.assign(defaultOptions, source.options || {});
  return buildTarget<Source, Structure>({
    ...source,
    options,
  } as unknown as Source);
};

export function buildServiceController<
  Source extends Structure,
  Structure extends Record<string, any> = ServiceController,
> (
  source: Omit<Source, "options"> & { options?: Partial<Controller["options"]> }
) {
  const options: Controller["options"] = 
    Object.assign(defaultOptions, source.options || {});
  return buildTarget<Source, Structure>({
    ...source,
    options,
  } as unknown as Source);
}