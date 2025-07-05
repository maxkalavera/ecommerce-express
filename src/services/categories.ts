import { Static, Type } from '@sinclair/typebox';
import { categoriesAccessor } from '@/accessors/categories';
import { CRUDService } from '@/utils/services/CRUDService';
import * as categoriesSchemas from '@/typebox/services/categories';

export class CategoriesService extends CRUDService {

  constructor() {
    super({
      executers: {
        create: async (data) => {
          return await categoriesAccessor.create(data.body!);
        },
        update: async (data) => {
          return await categoriesAccessor.update(data.params, data.body!);
        },
        delete: async (data) => {
          return await categoriesAccessor.delete(data.params);
        }, 
        read: async (data) => {
          return await categoriesAccessor.read(data.params);
        }, 
        list: async (data) => {
          return await categoriesAccessor.list(data.query);
        },
      },
      schemas: {
        instance: categoriesSchemas.Category,
        insert: categoriesSchemas.CategoryInsert,
        update: categoriesSchemas.CategoryUpdate,
        identifiers: categoriesSchemas.CategoryIdentifiers,
        queryParams: categoriesSchemas.CategoryQueryParams,
      }
    });
  }

  reshapePayload(instance: Record<string, any>) {
    return {
      key: instance.key,
      createdAt: instance.createdAt.toISOString(),
      updatedAt: instance.updatedAt.toISOString(),
      name: instance.name,
      description: instance.description,
      parentKey: instance.parentKey,
      display: null,
    };
  }

};
export const categoriesService = new CategoriesService();
