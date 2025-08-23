import lodash from 'lodash';
import settings from '@/settings';
import { productsAccessor, productsItemsAccessor, productsImagesAccessor } from '@/accessors/products';
import { CRUDService } from '@/utils/services/CRUDService';
import * as ProductsSchemas from '@/typebox/services/products';
import { categoriesAccessor } from '@/accessors/categories';

class ProductsService extends CRUDService {

  constructor() {
    super({
      executers: {
        read: async (data, {}) => {
          const productsItemsAccess = await productsItemsAccessor.read(data.params);
          if (productsItemsAccess.isSuccess()) {
            const product = productsItemsAccess.getPayload().data;

            // Images attachment
            const productsImagesAccess = await productsImagesAccessor.list({ 
              productId: product.productId 
            }, { usePagination: false });
            if (!productsImagesAccess.isSuccess()) {
              throw productsImagesAccess.getError();
            }
            const productImages = productsImagesAccess.getPayload();

            // Category and category breadcrumbs attachment
            const categoryAccess = await categoriesAccessor.read({ id: product.categoryId });
            if (!categoryAccess.isSuccess()) {
              throw categoryAccess.getError();
            }
            const category = categoryAccess.getPayload().data;
            let categoryBreadcrumbs = [category];

            if (typeof category.parentId === 'number') {
              const categoryParentAccess = await categoriesAccessor.read({
                id: category.parentId,
              });
              if (categoryParentAccess.isSuccess()) {
                categoryBreadcrumbs = [categoryParentAccess.getPayload().data, ...categoryBreadcrumbs];
              }
            }

            // Invenory to check availability of related product items
            const inventoryAccess = await productsAccessor.getProductInventory({ productId: product.productId });
            if (!inventoryAccess.isSuccess()) {
              throw inventoryAccess.getError();
            }
            const inventory = inventoryAccess.getPayload().items;

            return this.buildReturn({
              success: true,
              payload: {
                data: {
                  ...product,
                  images: productImages.items,
                  category: category,
                  categoryBreadcrumbs: categoryBreadcrumbs,
                  inventory: inventory,
                }
              }
            });
          }
          throw productsItemsAccess.getError();
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
        key: item.key,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        url: item.url,
        mimetype: item.mimetype,
        isCover: item.isCover,
      })),
      category: instance.category ? {
        key: instance.category.key,
        createdAt: instance.category.createdAt.toISOString(),
        updatedAt: instance.category.updatedAt.toISOString(),
        name: instance.category.name,
        description: instance.category.description,
      } : null,
      categoryBreadcrumbs: instance.categoryBreadcrumbs ? instance.categoryBreadcrumbs.map((item: Record<string, any>) => ({
        key: item.key,
        name: item.name
      })) : null,
      inventory: instance.inventory ? instance.inventory : null,
      maxAvailability: settings.PRODUCT_MAX_PUBLIC_AVAILABILITY,
    };
  }

};
export const productsService = new ProductsService();

