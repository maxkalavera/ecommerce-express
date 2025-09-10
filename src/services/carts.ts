import { cartsItemsAccessor } from '@/accessors/carts';
import { LayersReturnType, PayloadSingle, PayloadMany } from '@/types/layers';
import { CRUDService } from '@/utils/services/CRUDService';
import { RequestData } from '@/types/controllers';
import * as CartsSchemas from '@/typebox/services/carts';
import base64url from 'base64url';
import { productsItemsAccessor, productsImagesAccessor } from '@/accessors/products';

const DEFAULT_CART_KEY = base64url.encode("e108d29a-87ae-425c-bbc4-b38d10437f0a");

class CartsItemsService extends CRUDService {

  constructor() {
    super({
      executers: {
        create: async (data, { buildReturn }) => {
          const cartsItemsAccess = await cartsItemsAccessor.createOrUpdate({
            cartKey: DEFAULT_CART_KEY,
            productItemKey: data.body.productKey,
            quantity: data.body.quantity,
          }, {
            cartKey: DEFAULT_CART_KEY,
            productItemKey: data.body.productKey,
            quantity: data.body.quantity,
          });
          return await cartsItemsAccess.onSuccess(async (payload) => {
            return await cartsItemsAccessor.read({
              id: payload.data.id,
            });
          });
        },
        update: async (data, { buildReturn }) => {
          const cartsItemsAccess = await cartsItemsAccessor.update(data.params, {
            productItemKey: data.body.productKey,
            quantity: data.body.quantity,
          })
          return await cartsItemsAccess.onSuccess(async (payload) => {
            return await cartsItemsAccessor.read({
              id: payload.data.id,
            });
          });
        },
        delete: async (data, { buildReturn }) => {
          return await cartsItemsAccessor.delete(data.params);
        }, 
        read: async (data, { buildReturn }) => {
          return await cartsItemsAccessor.read(data.params);
        }, 
        list: async (data, { buildReturn }) => {
          const cartsItemsAccess = await cartsItemsAccessor.list({
            ...data.query,
            cartKey: DEFAULT_CART_KEY,
          });
          return await cartsItemsAccess.onSuccess(async (payload) => {
            // Get products
            const productsAccess = await productsItemsAccessor.list({ 
              ids: payload.items.map((item) => item.productItemId) 
            }, { usePagination: false });
            const productsItems = productsAccess.getPayload().items;

            // Get products images
            const productsImagesAccess = await productsImagesAccessor.list({ 
              productsIds: productsItems.map((item) => item.productId) 
            }, { usePagination: false });
            const productsImages = productsImagesAccess.getPayload().items;

            return buildReturn({
              success: true,
              payload: {
                ...payload,
                items: payload.items.map((item) => {
                  const productItem = (productsItems.find((productItem) => productItem.id === item.productItemId) || {});
                  return {
                    ...item,
                    product: {
                      ...productItem,
                      images: productsImages.filter((image) => image.productId === productItem.productId),
                    },
                  };
                }),
              }
            });
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
    const product = instance.product;
    return {
      key: instance.key,
      createdAt: instance.createdAt.toISOString(),
      updatedAt: instance.updatedAt.toISOString(),
      productKey: instance.productItemKey,
      quantity: instance.quantity,
      unitPrice: instance.unitPrice,
      product: product ? {
        key: product.key,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        name: product.name,
        description: product.description,
        price: product.price,
        isFavorite: product.isFavorite,
        isOnCart: product.isOnCart,
        quantity: product.quantity,
        size: product.size,
        color: {
          name: product.color,
          hex: product.colorHex,
        },
        label: (
          product.isLabeled 
          ? {
            content: product.labelContent,
            color: product.labelColor,
          }
          : null
        ),
        images: (product.images || []).map((item: Record<string, any>) => ({
          key: item.key,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
          url: item.url,
          mimetype: item.mimetype,
          isCover: item.isCover,
        })),
      } : null,
    };
  }

  async count(
    _data: Partial<RequestData>
  ): Promise<LayersReturnType<PayloadSingle<any>>>
  {
    return await cartsItemsAccessor.countItems({
      cartKey: DEFAULT_CART_KEY,
    });
  }

};
export const cartsItemsService = new CartsItemsService();
