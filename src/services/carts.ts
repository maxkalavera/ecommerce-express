import { CartsAccessor, CartsItemsAccessor } from '@/accessors/carts';
import { CRUDService } from '@/utils/services/CRUDService';
import * as CartsSchemas from '@/typebox/services/carts';


class CartsItemsService extends CRUDService {

  constructor() {
    super({
      executers: {
        create: async (data, { buildReturn }) => {
          // return await ___Accessor.create(data.body!);
          return buildReturn({ success: true, payload: { data: {} }});
        },
        update: async (data, { buildReturn }) => {
          // return await ___Accessor.update(data.params, data.body!);
          return buildReturn({ success: true, payload: { data: {} }});
        },
        delete: async (data, { buildReturn }) => {
          // return await ___Accessor.delete(data.params);
          return buildReturn({ success: true, payload: { data: {} }});
        }, 
        read: async (data, { buildReturn }) => {
          // return await ___Accessor.read(data.params);
          return buildReturn({ success: true, payload: { data: {} }});
        }, 
        list: async (data, { buildReturn }) => {
          // return await ___Accessor.list(data.query);
          return buildReturn({ success: true, payload: { items: [], cursor: null, hasMore: false }});
        },
      },
      schemas: {
        instance: CartsSchemas.CartItem,
        insert: CartsSchemas.CartItemInsert,
        update: CartsSchemas.CartItemUpdate,
        identifiers: CartsSchemas.CartItemIdentifiers,
        queryParams: CartsSchemas.CartItemQueryParams,
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
export const cartsItemsService = new CartsItemsService();
