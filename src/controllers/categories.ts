import { CRUDController } from '@/utils/controllers/CRUDController';
import { categoriesService } from '@/services/categories';


export const categoriesController = new CRUDController(
  'categories', 
  {
    operations: "all",
    executers: {
      create: async (requestData) => {
        return await categoriesService.create(requestData);
      },
      update: async (requestData) => {
        return await categoriesService.update(requestData);
      },
      delete: async (requestData) => {
        return await categoriesService.delete(requestData);
      },
      read: async (requestData) => {
        return await categoriesService.read(requestData);
      },
      list: async (requestData) => {
        return await categoriesService.list(requestData);
      }
    }
  }
);

