import { Request, Response, NextFunction } from 'express';
import { APIError } from '@/utils/errors';
import { CoreController } from '@/utils/controllers/CoreController'; 
import { RequestData, ControllerExecuters } from '@/types/controllers';


export class CRUDController extends CoreController {
  protected executers: ControllerExecuters;
  
  constructor(
    resourceName: string,
    _options: Partial<{
      executers: Partial<ControllerExecuters>;
    }> = {}
  ) {
    super(resourceName);
    const options = this._defaultsDeep(_options, {
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
    });
    this.executers = options.executers;
  }

  protected _defaultDocs() {
    this.docs.extend({
      paths: {
[`/${this.resourceName}`]: {
  post: {
    summary: `Create a new ${this.resourceName}`,
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object'
          }
        }
      }
    },
    responses: {
      '201': {
        description: `${this.resourceName} created successfully`,
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      }
    }
  },
  get: {
    summary: `List all ${this.resourceName}s`,
    responses: {
      '200': {
        description: `Array of ${this.resourceName}s`,
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        }
      }
    }
  }
},
[`/${this.resourceName}/{id}`]: {
  get: {
    summary: `Get a single ${this.resourceName}`,
    parameters: [{
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      '200': {
        description: `${this.resourceName} found`,
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      }
    }
  },
  put: {
    summary: `Update a ${this.resourceName}`,
    parameters: [{
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object'
          }
        }
      }
    },
    responses: {
      '200': {
        description: `${this.resourceName} updated successfully`,
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      }
    }
  },
  delete: {
    summary: `Delete a ${this.resourceName}`,
    parameters: [{
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      '200': {
        description: `${this.resourceName} deleted successfully`,
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      }
    }
  }
}
      }
    })  
  }

  protected _addCRUDRoutes() {
    this.router.post('/', this.create);
    this.router.put('/:id', this.update);
    this.router.delete('/:id', this.delete);
    this.router.get('/:id', this.read);
    this.router.get('/', this.list);
  }

  _addRoutes() {
    this._addCRUDRoutes();
  }

  protected _buildRequestData(
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
    const options = this._defaults(_options, {
      executer: this.executers.create,
    });

    await this._withErrors({ message: "Error creating resource" }, async () => {
      const data = this._buildRequestData(req);
      const result = await options.executer(data);
      if (result.isSuccess()) {
        res.status(201).json(result.getPayload());        
      }
      next(result.getError());
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
    const options = this._defaults(_options, {
      executer: this.executers.update,
    });

    await this._withErrors({ message: "Error updating resource" }, async () => {
      const data = this._buildRequestData(req);
      const result = await options.executer(data);
      if (result.isSuccess()) {
        res.status(201).json(result.getPayload());        
      }
      next(result.getError());
    });
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    return await this._update(req, res, next);
  }

  /****************************************************************************
   * Delete operations
   ***************************************************************************/

  protected async _delete(
    req: Request, res: Response, next: NextFunction,
    _options: Partial<{
      executer: ControllerExecuters['delete'];
    }> = {}
  ) {
    const options = this._defaults(_options, {
      executer: this.executers.delete,
    });

    await this._withErrors({ message: "Error deleting resource" }, async () => {
      const data = this._buildRequestData(req);
      const result = await options.executer(data);
      if (result.isSuccess()) {
        res.status(201).json(result.getPayload());        
      }
      next(result.getError());
    });
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    return await this._delete(req, res, next);
  }

  /****************************************************************************
   * Read operations
   ***************************************************************************/

  protected async _read(
    req: Request, res: Response, next: NextFunction,
    _options: Partial<{
      executer: ControllerExecuters['read'];
    }> = {}
  ) {
    const options = this._defaults(_options, {
      executer: this.executers.read,
    });

    await this._withErrors({ message: "Error reading resource" }, async () => {
      const data = this._buildRequestData(req);
      const result = await options.executer(data);
      if (result.isSuccess()) {
        res.status(201).json(result.getPayload());        
      }
      next(result.getError());
    });
  }

  public async read(req: Request, res: Response, next: NextFunction) {
    return await this._read(req, res, next);
  }

  /****************************************************************************
   * List operations
   ***************************************************************************/

  protected async _list(
    req: Request, res: Response, next: NextFunction,
    _options: Partial<{
      executer: ControllerExecuters['list'];
    }> = {}
  ) {
    const options = this._defaults(_options, {
      executer: this.executers.list,
    });

    await this._withErrors({ message: "Error listing resource" }, async () => {
      const data = this._buildRequestData(req);
      const result = await options.executer(data);
      if (result.isSuccess()) {
        res.status(201).json(result.getPayload());        
      }
      next(result.getError());
    });
  }

  public async list(req: Request, res: Response, next: NextFunction) {
    return await this._list(req, res, next);
  }
}