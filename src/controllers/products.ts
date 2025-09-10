import { CRUDController } from '@/utils/controllers/CRUDController';
import { productsService } from '@/services/products';


export const productsController = new CRUDController(
  'products',
  {
    operations: "view",
    executers: {
      create: async (requestData) => {
        return await productsService.create(requestData);
      },
      update: async (requestData) => {
        return await productsService.update(requestData);
      },
      delete: async (requestData) => {
        return await productsService.delete(requestData);
      },
      read: async (requestData) => {
        return await productsService.read(requestData);
      },
      list: async (requestData) => {
        return await productsService.list(requestData);
      }
    }
  }
);

export const favoritesProductsController = new CRUDController(
  'products',
  {
    operations: ["list", "create", "delete"],
    executers: {
      create: async (requestData) => {
        return await productsService.create(requestData);
      },
      update: async (requestData) => {
        return await productsService.update(requestData);
      },
      delete: async (requestData) => {
        return await productsService.delete(requestData);
      },
      read: async (requestData) => {
        return await productsService.read(requestData);
      },
      list: async (requestData) => {
        return await productsService.list(requestData);
      }
    }
  }
);
