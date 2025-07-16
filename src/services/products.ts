import { productsAccessor } from '@/accessors/products';
import { CRUDService } from '@/utils/services/CRUDService';
import * as ProductsSchemas from '@/typebox/services/products';

class ProductsService extends CRUDService {

  constructor() {
    super({
      executers: {
        create: async (data, { buildReturn }) => {
          return await productsAccessor.create(data.body!);
        },
        update: async (data, { buildReturn }) => {
          return await productsAccessor.update(data.params, data.body!);
        },
        delete: async (data, { buildReturn }) => {
          return await productsAccessor.delete(data.params);
        }, 
        read: async (data, { buildReturn }) => {
          return await productsAccessor.read(data.params);
        }, 
        list: async (data, { buildReturn }) => {
          return await productsAccessor.list(data.query);
        },
      },
      schemas: {
        instance: ProductsSchemas.Product,
        insert: ProductsSchemas.ProductInsert,
        update: ProductsSchemas.ProductUpdate,
        identifiers: ProductsSchemas.ProductIdentifiers,
        queryParams: ProductsSchemas.ProductQueryParams,
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
      price: instance.price,
      color: {
        name: instance.color,
        hex: instance.colorHex,
      },
      label: instance.isLabeled 
        ? {
          content: instance.labelContent,
          color: instance.labelColor,
        }
        : null
    };
  }

};
export const productsService = new ProductsService();

