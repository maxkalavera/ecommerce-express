import { Type } from '@sinclair/typebox';
import { CoreService } from '@/utils/services/CoreService';
import { LayersReturnType, PayloadSingle, PayloadMany } from '@/types/layers';
import { 
  RequestData,
  ServiceSchemas, ServiceTaskSchemas, ServiceExecuters
} from '@/types/services';


export class CRUDService extends CoreService {
  protected options: {
    executers: ServiceExecuters;
    schemas: ServiceSchemas
  };

  constructor(
    _options: Partial<{
      executers: Partial<ServiceExecuters>;
      schemas: Partial<ServiceSchemas>;
    }> = {}
  ) {
    super();
    this.options = this.defaultsDeep(_options, {
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
      schemas: {
        instance: Type.Record(Type.String(), Type.Any()),
        insert: Type.Record(Type.String(), Type.Any()),
        update: Type.Record(Type.String(), Type.Any()),
        identifiers: Type.Record(Type.String(), Type.Any()),
        queryParams: Type.Record(Type.String(), Type.Any()),
      },
    });
  }

  /****************************************************************************
   * Create operations
   ***************************************************************************/

  public async create(
    data: Partial<RequestData>,
    execute: ServiceExecuters['create'] = this.options.executers.create,
    schemas: Partial<ServiceTaskSchemas> = {
      body: this.options.schemas.insert,
      payloadInstance: this.options.schemas.instance,
    }
  ): Promise<LayersReturnType<PayloadSingle<any>>>
  {
    return await this.wrap(data, execute, schemas) as LayersReturnType<PayloadSingle<any>>;
  }

  /****************************************************************************
   * Update operations
   ***************************************************************************/

  public async update(
    data: Partial<RequestData>,
    execute: ServiceExecuters['update'] = this.options.executers.update,
    schemas: Partial<ServiceTaskSchemas> = {
      params: this.options.schemas.identifiers,
      body: this.options.schemas.update,
      payloadInstance: this.options.schemas.instance,
    }
  ): Promise<LayersReturnType<PayloadSingle<any>>>
  {
    return await this.wrap(data, execute, schemas) as LayersReturnType<PayloadSingle<any>>;
  }

  /****************************************************************************
   * Delete operations
   ***************************************************************************/

  public async delete(
    data: Partial<RequestData>,
    execute: ServiceExecuters['delete'] = this.options.executers.delete,
    schemas: Partial<ServiceTaskSchemas> = {
      params: this.options.schemas.identifiers,
      payloadInstance: this.options.schemas.instance,
    }
  ): Promise<LayersReturnType<PayloadSingle<any>>>
  {
    return await this.wrap(data, execute, schemas) as LayersReturnType<PayloadSingle<any>>;
  }

  /****************************************************************************
   * Read operations
   ***************************************************************************/

  public async read(
    data: Partial<RequestData>,
    execute: ServiceExecuters['read'] = this.options.executers.read,
    schemas: Partial<ServiceTaskSchemas> = {
      params: this.options.schemas.identifiers,
      payloadInstance: this.options.schemas.instance,
    }
  ): Promise<LayersReturnType<PayloadSingle<any>>>
  {
    return await this.wrap(data, execute, schemas) as LayersReturnType<PayloadSingle<any>>;
  }

  /****************************************************************************
   * All operations
   ***************************************************************************/

  public async list(
    data: Partial<RequestData>,
    execute: ServiceExecuters['list'] = this.options.executers.list,
    schemas: Partial<ServiceTaskSchemas> = {
      query: this.options.schemas.queryParams,
      payloadInstance: this.options.schemas.instance,
    }
  ): Promise<LayersReturnType<PayloadMany<any>>>
  {
    return await this.wrap(data, execute, schemas) as LayersReturnType<PayloadMany<any>>;
  }

}