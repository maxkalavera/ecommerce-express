import lodash from 'lodash';
import { productsAccessor, productsItemsAccessor, productsImagesAccessor } from '@/accessors/products';
import { CRUDService } from '@/utils/services/CRUDService';
import * as ProductsSchemas from '@/typebox/services/products';

class ProductsService extends CRUDService {

  constructor() {
    super({
      executers: {
        read: async (data, {}) => {
          const productsItemsPayload = await productsItemsAccessor.read(data.params);
          if (productsItemsPayload.isSuccess()) {
            const productData = productsItemsPayload.getPayload();
            const productsImagesPayload = await productsImagesAccessor.list({ productId: productData.data.productId }, { usePagination: false });
            if (productsImagesPayload.isSuccess()) {
              const productImages = productsImagesPayload.getPayload();
              return this.buildReturn({
                success: true,
                payload: {
                  data: {
                    ...productData.data,
                    images: productImages.items
                  }
                }
              })
            }
            throw productsImagesPayload.getError();
          }
          throw productsItemsPayload.getError();
        }, 
        
        list: async (data, {}) => {
          // get products from items
          const productsItemsPayload = await productsItemsAccessor.list(data.query);

          if (productsItemsPayload.isSuccess()) {
            const productsItems = productsItemsPayload.getPayload();
            const ids = productsItems.items.map(item => (item.productId));

            // Ger images for each product
            const productsImagesPayload = await productsImagesAccessor.list({ productsIds: ids }, { usePagination: false });
            if (productsImagesPayload.isSuccess()) {
              const productsImages = productsImagesPayload.getPayload();
              // Grouping and assigning the images to their products
              const groupedImages = lodash.groupBy(productsImages.items, (item) => item.productId);
              for (const productItem of productsItems.items) {
                productItem.images = [...(groupedImages[productItem.productId] || [])];
              }
              // Return products
              return this.buildReturn({
                success: true,
                payload: productsItems
              });
            }
            throw productsImagesPayload.getError();
          }
          throw productsItemsPayload.getError();
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
      isFavorite: instance.isFavorite,
      isOnCart: instance.isOnCart,
      quantity: instance.quantity,
      size: instance.size,
      color: {
        name: instance.color,
        hex: instance.colorHex,
      },
      label: (
        instance.isLabeled 
        ? {
          content: instance.labelContent,
          color: instance.labelColor,
        }
        : null
      ),
      images: (instance.images || []).map((item: Record<string, any>) => ({
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        url: item.url,
        mimetype: item.mimetype,
        isCover: item.isCover,
      }))
    };
  }

};
export const productsService = new ProductsService();

