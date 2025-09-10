import { Request, Response, NextFunction } from 'express';
import { RequestData, ControllerExecuters } from '@/types/controllers';
import { CRUDController } from '@/utils/controllers/CRUDController';
import { cartsItemsService } from '@/services/carts';


class CartsItemsController extends CRUDController {
  constructor() {
    super(
      'carts/items', 
      {
        operations: ['create', 'update', 'delete', 'list'],
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
          },
        }
      }
    );
  }

  async countExecuter(...args: Parameters<ControllerExecuters['read']>) {
    const requestData = args[0];
    return await cartsItemsService.count(requestData);
  }

  addRoutes() {
    super.addRoutes();
    this.router.get('/count', this.count.bind(this));
  }

  async count(
    req: Request, 
    res: Response, 
    next: NextFunction,
  ) {
    try {
      const data = this.buildRequestData(req);
      const result = await this.countExecuter(data, { buildReturn: this.buildReturn });
      if (result.isSuccess()) {
        res.status(201).json(result.getPayload());
        return;
      }
      return next(result.getError());
    } catch (error) {
      throw this.buildError({
        public: {
        message: "Error reading resource",
        code: 500,
      }, 
      sensitive: {
        message: "Error reading resource",
      }
      }, error);
    }
  }
}

export const cartsItemsController = new CartsItemsController();
