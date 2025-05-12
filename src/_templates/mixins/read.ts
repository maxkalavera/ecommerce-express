import { ReadOperation, ReadAllOperation } from "@/types/_resources";
import { withRead as _withRead, withReadAll as _withReadAll } from "@/commons/mixins/read";

export function withRead<
  Source extends Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    ..._withRead(source),
    async validateRead (data) {
      throw new Error("Not implemented");
    },
    async commitRead (data) {
      throw new Error("Not implemented");
    },
  } as Source & ReadOperation<
    Record<string, any>,
    Record<string, any>
  >
};

export function withReadAll<
  Source extends Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    ..._withReadAll(source),
    async validateReadAll (data) {
      throw new Error("Not implemented");
    },
    async commitReadAll (data) {
      throw new Error("Not implemented");
    },
  } as Source & ReadAllOperation<
    Record<string, any>,
    Record<string, any>
  >
};