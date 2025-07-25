import { Type, TSchema, Static } from '@sinclair/typebox';
import { LayersCore } from '@/utils/layers/LayersCore';
import { LayersReturnType, PayloadSingle, PayloadMany } from '@/types/layers';
import { RequestData, RequestDataSchemas, ServiceTaskSchemas, ServiceExecuter } from '@/types/services'
import { PayloadSingleSchema, PayloadManySchema } from '@/typebox/commons';


/******************************************************************************
 * CoreService
 *****************************************************************************/

export class CoreService extends LayersCore {

  constructor() {
    super();
  }

  protected validateRequestParams(
    _data: Partial<RequestData> = {},
    _schemas: Partial<RequestDataSchemas> = {}
  ) {
    const data: Required<RequestData> = this.defaults(_data, { 
      params: {}, 
      query: {}, 
      body: {},
    });
    const schemas: RequestDataSchemas = this.defaults(_schemas, {
      params: Type.Object({}),
      query: Type.Object({}),
      body: Type.Object({}),
    });

    const paramsValidation = this.validate(schemas.params, data.params, { additionalProperties: 'strict-dev-only' });
    if (!paramsValidation.success) {
      throw this.buildError({}, {
        message: 'Error while validating params data',
        details: paramsValidation.errors,
      });
    }
    data.params = paramsValidation.data;

    const queryCohersion = this.coherce(schemas.query, data.query, { additionalProperties: 'strict-dev-only' });
    if (!queryCohersion.success) {
      throw this.buildError({

      }, {
        message: 'Error while validating query data',
        details: queryCohersion.errors,
      });
    }
    data.query = queryCohersion.data;

    const bodyCohersion = this.coherce(schemas.body, data.body, { additionalProperties: 'strict-dev-only' });
    if (!bodyCohersion.success) {
      throw this.buildError({

      }, {
        message: 'Error while validating body data',
        details: bodyCohersion.errors,
      });
    }
    data.body = bodyCohersion.data;
  
    return data;
  }

  protected validatePayload<
    PayloadType extends PayloadSingle<any> | PayloadMany<any>
  > (
    schema: TSchema,
    data: LayersReturnType<PayloadType>,
  ): LayersReturnType<PayloadType>
  {
    data.onSuccessSync((payload) => {
      if ((payload as PayloadMany<any>).items !== undefined) {
        for (const item of (payload as PayloadMany<any>).items) {
          const itemValidation = this.validate(schema, item, { additionalProperties: 'strict-dev-only' });
          if (!itemValidation.success) {
            throw this.buildError({}, {
              message: 'Error while validating service payload',
              details: itemValidation.errors
            });
          }
        }
      } else {
        const validation = this.validate(schema, (payload as PayloadSingle<any>).data, { additionalProperties: 'strict-dev-only' });
        if (!validation.success) {
          throw this.buildError({}, {
            message: 'Error while validating service payload',
            details: validation.errors
          });
        }
      }
    });

    return data;
  }

  protected executeReshapePayload<
    PayloadType extends PayloadSingle<any> | PayloadMany<any>
  > (
    data: LayersReturnType<PayloadType>,
    _mapper: ((instance: Record<string, any>) => Record<string, any>) | null = null
  ): LayersReturnType<PayloadType> 
  {
    if (!data.isSuccess()) {
      return data;
    }
    const payload = data.getPayload();
    data.onSuccessSync(() => {
      const mapper = _mapper === null ? this.reshapePayload : _mapper;
      if ((payload as PayloadSingle<any>).data !== undefined) {
        (payload as PayloadSingle<any>).data = mapper((payload as PayloadSingle<any>).data);
      } else if ((payload as PayloadMany<any>).items !== undefined) {
        (payload as PayloadMany<any>).items = (payload as PayloadMany<any>).items.map(item => mapper(item));
      }
    });
    return this.buildReturn({ success: true, payload });
  }

  protected reshapePayload(
    instance: Record<string, any>
  ): Record<string, any> 
  {
    return instance;
  }

  /**
   * Reshapes and validates request data before executing the main service logic:
   * - Set defaults in data
   * - Validate request params
   * - execute the callback to execute the service operation
   * - Reshape payload data to fulfill the schema definition
   * - Validate payload using the schema definition
   * 
   * @template PayloadType - Type extending either PayloadSingle or PayloadMany
   * @param {Partial<RequestData>} _data - Request data containing params, query and body
   * @param {Function} callback - Async function containing the main service logic
   * @param {Partial<ServiceTaskSchemas>} _schemas - Validation schemas for request data and payload
   * @param {Function | null} mapper - Optional function to transform payload data
   * @returns {Promise<LayersReturnType<PayloadType>>} - Returns processed and validated service response
   * 
   * @protected
   * @async
   */
  protected async wrap<
    PayloadType extends PayloadSingle<any> | PayloadMany<any>
  > (
    _data: Partial<RequestData>,
    callback: ServiceExecuter, 
    _schemas: Partial<ServiceTaskSchemas> = {},
    mapper: ((data: Record<string, any>) => Record<string, any>) | null = null,
  ) 
  {
    const schemas = this.defaults(_schemas, {
      params: Type.Record(Type.String(), Type.Any()),
      query: Type.Record(Type.String(), Type.Any()),
      body: Type.Record(Type.String(), Type.Any()),
      payloadInstance: Type.Record(Type.String(), Type.Any()),
    });
    const data: RequestData = this.defaults(_data, { params: {}, query: {}, body: {}});
    this.validateRequestParams(data, {
      params: schemas.params,
      query: schemas.query,
      body: schemas.body,
    });
    let result = await callback(data, { buildReturn: this.buildReturn });
    result = this.executeReshapePayload(result as LayersReturnType<PayloadType>, mapper);
    this.validatePayload(schemas.payloadInstance, result);

    return result;
  }
}
