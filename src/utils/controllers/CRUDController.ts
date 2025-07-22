import { Request, Response, NextFunction } from 'express';
import { CoreController } from '@/utils/controllers/CoreController'; 
import { RequestData, ControllerExecuters } from '@/types/controllers';


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

  protected async _create(
    req: Request, res: Response, next: NextFunction,
    _options: Partial<{
      executer: ControllerExecuters['create'];
    }> = {}
  ) {
    const options = this.defaults(_options, {
      executer: this.executers.create,
    });

    await this.withErrors({ message: "Error creating resource" }, async () => {
      const data = this.buildRequestData(req);
      const result = await options.executer(data, { buildReturn: this.buildReturn });
      if (result.isSuccess()) {
        return res.status(201).json(result.getPayload());        
      }
      return next(result.getError());
    });
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    return await this._create(req, res, next);
  }

  /****************************************************************************
   * Update operations
   ***************************************************************************/
  
  protected async _update(
    req: Request, res: Response, next: NextFunction,
    _options: Partial<{
      executer: ControllerExecuters['update'];
    }> = {}
  ) {
    const options = this.defaults(_options, {
      executer: this.executers.update,
    });

    await this.withErrors({ message: "Error updating resource" }, async () => {
      const data = this.buildRequestData(req);
      const result = await options.executer(data, { buildReturn: this.buildReturn });
      if (result.isSuccess()) {
        return res.status(201).json(result.getPayload());        
      }
      return next(result.getError());
    });
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    return await this._update(req, res, next);
  }

  /****************************************************************************
   * Delete operations
   ***************************************************************************/

    protected async delete(
      req: Request, 
      res: Response, 
      next: NextFunction,
    ) {
      await this.withErrors({ message: "Error deleting resource" }, async () => {
        const data = this.buildRequestData(req);
        const result = await this.executers.delete(data, { buildReturn: this.buildReturn });
        if (result.isSuccess()) {
          return res.status(201).json(result.getPayload());        
        }
        return next(result.getError());
      });
    };

  /****************************************************************************
   * Read operations
   ***************************************************************************/

  protected async read(
    req: Request, 
    res: Response, 
    next: NextFunction,
  ) {
    await this.withErrors({ message: "Error reading resource" }, async () => {
      const data = this.buildRequestData(req);
      const result = await this.executers.read(data, { buildReturn: this.buildReturn });
      if (result.isSuccess()) {
        return res.status(201).json(result.getPayload());        
      }
      return next(result.getError());
    });
  }

  /****************************************************************************
   * List operations
   ***************************************************************************/

  protected async list(
    req: Request, 
    res: Response, 
    next: NextFunction,
  ) {
    await this.withErrors({ message: "Error listing resource" }, async () => {
      const data = this.buildRequestData(req);
      const result = await this.executers.list(data, { buildReturn: this.buildReturn });
      if (result.isSuccess()) {
        return res.status(201).json(result.getPayload());        
      }
      return next(result.getError());
    });
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