// @ts-nocheck

import { ___Accessor } from '@/accessors/___';
import { CRUDService } from '@/utils/services/CRUDService';
import * as ___Schemas from '@/typebox/services/___';


class ___Service extends CRUDService {

  constructor() {
    super({
      executers: {
        create: async (data, { buildReturn }) => {
          return await ___Accessor.create(data.body!);
        },
        update: async (data, { buildReturn }) => {
          return await ___Accessor.update(data.params, data.body!);
        },
        delete: async (data, { buildReturn }) => {
          return await ___Accessor.delete(data.params);
        }, 
        read: async (data, { buildReturn }) => {
          return await ___Accessor.read(data.params);
        }, 
        list: async (data, { buildReturn }) => {
          return await ___Accessor.list(data.query);
        },
      },
      schemas: {
        instance: ___Schemas.___,
        insert: ___Schemas.___Insert,
        update: ___Schemas.___Update,
        identifiers: ___Schemas.___Identifiers,
        queryParams: ___Schemas.___QueryParams,
      }
    });
  }

  reshapePayload(instance: Record<string, any>) {
    return {
      key: instance.key,
      createdAt: instance.createdAt.toISOString(),
      updatedAt: instance.updatedAt.toISOString(),
    };
  }

};
export const ___Service = new ___Service();
