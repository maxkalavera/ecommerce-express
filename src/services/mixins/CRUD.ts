import { AccessorService } from "@/services/utils/types";
import { ResultPayload } from "@/types/resources";

/******************************************************************************
 * Types
 *****************************************************************************/

export type CRUDService<
  Input extends Record<string, any>,
  Result extends Record<string, any>,
> = {
  commitCreate: (
    data: Input
  ) => Promise<ResultPayload<Result>>;
  create: (
    data: Input
  ) => Promise<ResultPayload<Result>>;
  
  commitRead: (
    data: Input
  ) => Promise<ResultPayload<Result>>;
  read: (
    data: Input
  ) => Promise<ResultPayload<Result>>;

  commitReadAll: (
    data: Input
  ) => Promise<ResultPayload<Result[]>>;
  readAll: (
    data: Input
  ) => Promise<ResultPayload<Result[]>>;

  commitUpdate: (
    data: Input
  ) => Promise<ResultPayload<Result>>;
  update: (
    data: Input
  ) => Promise<ResultPayload<Result>>;

  commitDelete: (
    data: Input
  ) => Promise<ResultPayload<Result>>;
  delete: (
    data: Input
  ) => Promise<ResultPayload<Result>>;
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
    async commitCreate(data) {
      if (typeof source.accessor.create === 'function') {
        return await source.accessor.create(data);
      } else {
        throw new Error('Accessor does not implement create method');
      }
    },
    async create(data) {
      return this.commitCreate(data);
    },
    async commitRead(data) {
      if (typeof source.accessor.read === 'function') {
        return await source.accessor.read(data);
      } else {
        throw new Error('Accessor does not implement read method');
      }
    },
    async read(data) {
      return this.commitRead(data);
    },
    async commitReadAll(data) {
      if (typeof source.accessor.readAll === 'function') {
        return await source.accessor.readAll(data);
      } else {
        throw new Error('Accessor does not implement readAll method');
      }
    },
    async readAll(data) {
      return this.commitReadAll(data);
    },
    async commitUpdate(data) {
      if (typeof source.accessor.update === 'function') {
        return await source.accessor.update(data);
      } else {
        throw new Error('Accessor does not implement update method');
      }
    },
    async update(data) {
      return this.commitUpdate(data);
    },
    async commitDelete(data) {
      if (typeof source.accessor.delete === 'function') {
        return await source.accessor.delete(data);
      } else {
        throw new Error('Accessor does not implement delete method');
      }
    },
    async delete(data) {
      return this.commitDelete(data);
    }
  } as Source & CRUDService<
    Record<string, any>,
    Record<string, any>
  >;
}

