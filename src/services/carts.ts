import { cartsAccessor, cartsItemsAccessor } from '@/accessors/carts';
import { CRUDService } from '@/utils/services/CRUDService';
import * as CartsSchemas from '@/typebox/services/carts';
import base64url from 'base64url';

const DEFAULT_CART_KEY = base64url.encode("e108d29a-87ae-425c-bbc4-b38d10437f0a");

class CartsItemsService extends CRUDService {

  constructor() {
    super({
      executers: {
        create: async (data, { buildReturn }) => {
          return await cartsItemsAccessor.create({
            cartKey: DEFAULT_CART_KEY,
            productItemKey: data.body.productKey
          });
        },
        update: async (data, { buildReturn }) => {
          return await cartsItemsAccessor.update(data.params, {
            productItemKey: data.body.productKey
          });
        },
        delete: async (data, { buildReturn }) => {
          return await cartsItemsAccessor.delete(data.params);
        }, 
        read: async (data, { buildReturn }) => {
          return await cartsItemsAccessor.read(data.params);
        }, 
        list: async (data, { buildReturn }) => {
          return await cartsItemsAccessor.list({
            ...data.query,
            cartKey: DEFAULT_CART_KEY,
          });
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
      productKey: instance.productItemKey,
    };
  }

};
export const cartsItemsService = new CartsItemsService();
