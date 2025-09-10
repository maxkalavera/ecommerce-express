import { Type } from '@sinclair/typebox';
import { Nullable, Base64URL, Decimal } from '@/utils/typebox';
import { categoriesAccessor } from '@/accessors/categories';
import { CRUDService } from '@/utils/services/CRUDService';
import * as categoriesSchemas from '@/typebox/services/categories';

class CategoriesService extends CRUDService {

  constructor() {
    super({
      schemas: {
        instance: categoriesSchemas.Category,
        insert: categoriesSchemas.CategoryInsert,
        update: categoriesSchemas.CategoryUpdate,
        identifiers: categoriesSchemas.CategoryIdentifiers,
        queryParams: categoriesSchemas.CategoryQueryParams,
      },
      executers: {
        create: async (data) => {
          return await categoriesAccessor.create(data.body!);
        },
        update: async (data) => {
          const categoriesAccess = await categoriesAccessor.update(data.params, data.body!);
          return await categoriesAccess.onSuccess(async (payload) => {
            return await categoriesAccessor.read({
              id: payload.data.id,
            });
          });
        },
        delete: async (data) => {
          return await categoriesAccessor.delete(data.params);
        }, 
        read: async (data) => {
          const categoriesPayload = await categoriesAccessor.read(data.params);
          if (categoriesPayload.isSuccess()) {
            const payload = categoriesPayload.getPayload();
            let breadcrumbs = [payload.data]

            if (typeof payload.data.parentId === 'number') {
              const parentPayload = await categoriesAccessor.read({
                id: payload.data.parentId,
              });
              if (parentPayload.isSuccess()) {
                breadcrumbs = [parentPayload.getPayload().data, ...breadcrumbs];
              }
            }

            return this.buildReturn({
              success: true,
              payload: {
                ...payload,
                data: {
                  ...payload.data,
                  breadcrumbs,
                }
              },
            });
          }

          return categoriesPayload;
        }, 
        list: async (data) => {
          return await categoriesAccessor.list(data.query);
        },
      },
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
      display: {
        url: instance.display.url,
        mimetype: instance.display.mimetype,
      },
      breadcrumbs: Array.isArray(instance.breadcrumbs) 
        ? instance.breadcrumbs.map((item: Record<string, any>) => ({
          key: item.key,
          name: item.name,
        }))
        : null,
    };
  }

};
export const categoriesService = new CategoriesService();
