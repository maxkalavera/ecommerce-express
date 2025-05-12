import { AccessorService, ServicePayload } from "@/services/utils/types";
import { MergeObjects } from "@/utils/patterns/nomads";

/******************************************************************************
 * Types
 *****************************************************************************/

export type CRUDService<
  InputData extends Record<string, any>,
  Result extends Record<string, any> = InputData,
> = {
  create: (
    data: InputData
  ) => Promise<ServicePayload<Result>>;
  read: (
    data: InputData
  ) => Promise<ServicePayload<Result>>;
  readAll: () => Promise<ServicePayload<Result[]>>;
  update: (
    data: InputData
  ) => Promise<ServicePayload<Result>>;
  delete: (
    data: InputData
  ) => Promise<ServicePayload<Result>>;
}

/******************************************************************************
 * Mutators
 *****************************************************************************/

export function withCRUD<
  Source extends AccessorService,
> (
  source: Source,
) {
  return {
    ...source,
    create: async (data) => {
      if (typeof source.accessor.create === 'function') {
        return await source.accessor.create(data);
      } else {
        throw new Error('Accessor does not implement create method');
      }
    },
    read: async (data) => {
      if (typeof source.accessor.read === 'function') {
        return await source.accessor.read(data);
      } else {
        throw new Error('Accessor does not implement read method');
      }
    },
    readAll: async () => {
      if (typeof source.accessor.readAll === 'function') {
        return await source.accessor.readAll();
      } else {
        throw new Error('Accessor does not implement readAll method');
      }
    },
    update: async (data) => {
      if (typeof source.accessor.update === 'function') {
        return await source.accessor.update(data);
      } else {
        throw new Error('Accessor does not implement update method');
      }
    },
    delete: async (data) => {
      if (typeof source.accessor.delete === 'function') {
        return await source.accessor.delete(data);
      } else {
        throw new Error('Accessor does not implement delete method');
      }
    },
  } as MergeObjects<Source, CRUDService<Record<string, any>>>;
}

