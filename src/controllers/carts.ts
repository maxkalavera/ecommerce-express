import { CRUDController } from '@/utils/controllers/CRUDController';
import { cartsItemsService } from '@/services/carts';


export const CartsItemsController = new CRUDController(
  'carts/items', 
  {
    executers: {
      create: async (requestData) => {
        return await cartsItemsService.create(requestData);
      },
      update: async (requestData) => {
        return await cartsItemsService.update(requestData);
      },
      delete: async (requestData) => {
        return await cartsItemsService.delete(requestData);
      },
      read: async (requestData) => {
        return await cartsItemsService.read(requestData);
      },
      list: async (requestData) => {
        return await cartsItemsService.list(requestData);
      }
    }
  }
);