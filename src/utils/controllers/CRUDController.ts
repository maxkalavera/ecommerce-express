import { Request, Response, NextFunction } from 'express';
import { CoreController } from '@/utils/controllers/CoreController'; 
import { RequestData, ControllerExecuters } from '@/types/controllers';
import { APIError } from '@/utils/errors';


type CRUDKeyword = "create" | "update" | "delete" | "read" | "list" | "view" | "mutate" | "all";


export class CRUDController extends CoreController {
  protected executers: ControllerExecuters;
  protected defaultIdentifierParam: string = 'key';
  protected crudAllowedOperations: (CRUDKeyword)[];
  
  constructor(
    resourceName: string,
    _options: Partial<{
      executers: Partial<ControllerExecuters>;
      operations: (CRUDKeyword)[] | CRUDKeyword;
    }> = {}
  ) {
    super(resourceName);
    const options = this.defaultsDeep(_options, {
      operations: "all",
      executers: {
        create: async () => {
          throw ('"create" is not implemented');
        },
        update: async () => {
          throw ('"update" is not implemented');
        },
        delete: async () => {
          throw ('"delete" is not implemented');
        },
        read: async () => {
          throw ('"read" is not implemented');
        },
        list: async () => {
          throw ('"list" is not implemented');
        },
      },
    } as {
      executers: ControllerExecuters;
      operations: (CRUDKeyword)[] | CRUDKeyword;
    });
    this.executers = options.executers;
    this.crudAllowedOperations = Array.isArray(options.operations) 
      ? options.operations 
      : [options.operations];
  }

  protected addCRUDRoutes() {
    if (multipleContains(this.crudAllowedOperations, ["all", "create", "mutate"])) {
      this.router.post('/', this.create.bind(this));
    }
    if (multipleContains(this.crudAllowedOperations, ["all", "update", "mutate"])) {
      this.router.put(`/:${this.defaultIdentifierParam}`, this.update.bind(this));
    }
    if (multipleContains(this.crudAllowedOperations, ["all", "delete", "mutate"])) {
      this.router.delete(`/:${this.defaultIdentifierParam}`, this.delete.bind(this));
    }
    if (multipleContains(this.crudAllowedOperations, ["all", "read", "view"])) {
      this.router.get(`/:${this.defaultIdentifierParam}`, this.read.bind(this));
    }
    if (multipleContains(this.crudAllowedOperations, ["all", "list", "view"])) {
      this.router.get('/', this.list.bind(this));
    }
  }

  addRoutes() {
    this.addCRUDRoutes();
  }

  protected buildRequestData(
    req: Request
  ): RequestData
  {
    return {
      params: req.params,
      query: req.query,
      body: req.body,
    }
  }

  /****************************************************************************
   * Create operations
   ***************************************************************************/

  protected async create(
    req: Request, 
    res: Response, 
    next: NextFunction,
  )
  {
    try {
      const data = this.buildRequestData(req);
      const result = await this.executers.create(data, { buildReturn: this.buildReturn });
      if (result.isSuccess()) {
        res.status(201).json(result.getPayload());
        return;
      }
      return next(result.getError());
    } catch (error) {
      throw this.buildError({
        public: {
          message: "Error creating resource",
          code: 500,        
        }, 
        sensitive: {
          message: "Error creating resource",
        }
      }, error);
    }
  }

  /****************************************************************************
   * Update operations
   ***************************************************************************/
  
  protected async update(
    req: Request, 
    res: Response, 
    next: NextFunction,
  ) {
    try {
      const data = this.buildRequestData(req);
      const result = await this.executers.update(data, { buildReturn: this.buildReturn });
      if (result.isSuccess()) {
        res.status(201).json(result.getPayload());
        return;
      }
      return next(result.getError());
    } catch (error) {
      throw this.buildError({
        public: {
          message: "Error updating resource",
          code: 500,
        }, 
        sensitive: {
          message: "Error updating resource",
        }
      }, error);
    };
  }

  /****************************************************************************
   * Delete operations
   ***************************************************************************/

    protected async delete(
      req: Request, 
      res: Response, 
      next: NextFunction,
    ) {
      try {
        const data = this.buildRequestData(req);
        const result = await this.executers.delete(data, { buildReturn: this.buildReturn });
        if (result.isSuccess()) {
          res.status(201).json(result.getPayload());
          return;
        }
        return next(result.getError());
      } catch (error) {
        throw this.buildError({
          public: {
            message: "Error deleting resource",
            code: 500,
          }, 
          sensitive: {
            message: "Error deleting resource",
          }
        }, error);
      }
    };

  /****************************************************************************
   * Read operations
   ***************************************************************************/

  protected async read(
    req: Request, 
    res: Response, 
    next: NextFunction,
  ) {
    try {
      const data = this.buildRequestData(req);
      const result = await this.executers.read(data, { buildReturn: this.buildReturn });
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

  /****************************************************************************
   * List operations
   ***************************************************************************/

  protected async list(
    req: Request, 
    res: Response, 
    next: NextFunction,
  ) {
    try {
      const data = this.buildRequestData(req);
      const result = await this.executers.list(data, { buildReturn: this.buildReturn });
      if (result.isSuccess()) {
        res.status(201).json(result.getPayload());
        return;
      }
      return next(result.getError());
    } catch (error) {
      throw this.buildError({
        public: {
        message: "Error listing resource",
        code: 500,
      }, 
      sensitive: {
        message: "Error listing resource",
      }
      }, error);
    }
  }
  
}


/******************************************************************************
 * Utils
 *****************************************************************************/

function multipleContains(
  arr: string[], 
  values: string[]
) {
  // Check if array contains any of the given values
  return values.some(value => arr.includes(value));

}