import { Type, TSchema, Static } from '@sinclair/typebox';
import { LayersCore } from '@/utils/layers/LayersCore'; 
import { validate } from '@/utils/validator';
import { LayersReturnType, PayloadSingle, PayloadMany } from '@/types/layers';
import { RequestData, RequestDataSchemas, ServiceTaskSchemas } from '@/types/services'


/******************************************************************************
 * CoreService
 *****************************************************************************/

export class CoreService extends LayersCore {

  constructor() {
    super();
  }

  protected _validateSchema(schema: TSchema, data: Record<string, any>) {
    return validate({
      ...schema,
      additionalProperties: false,
    }, data);
  }

  protected _validateRequestParams(
    _data: Partial<RequestData> = {},
    _schemas: Partial<RequestDataSchemas> = {}
  ) {
    const data: Required<RequestData> = this._defaults(_data, { 
      params: {}, 
      query: {}, 
      body: {},
    });
    const schemas: RequestDataSchemas = this._defaults(_schemas, {
      params: Type.Object({}),
      query: Type.Object({}),
      body: Type.Object({}),
    })

    this._validateSchema(schemas.params, data.params);
    this._validateSchema(schemas.query, data.query);
    this._validateSchema(schemas.body, data.body);
  
    return data;
  }

  protected _validatePayload<
    PayloadType extends PayloadSingle<any> | PayloadMany<any>
  > (
    data: LayersReturnType<PayloadType>,
    validationSchema: TSchema = Type.Record(Type.String(), Type.Any())
  ): LayersReturnType<PayloadType>
  {
    data.onSuccessSync((payload) => {
      if ((payload as PayloadSingle<any>).data !== undefined) {
        this._validateSchema(validationSchema, (payload as PayloadSingle<any>).data);
      } else if ((payload as PayloadMany<any>).items !== undefined) {
        (payload as PayloadMany<any>).items.forEach((item) => {
          this._validateSchema(validationSchema, item);
        });
      }
    });

    return data;
  }

  protected _reshapePayload<
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
    return this._buildReturn({ success: true, payload });
  }

  protected reshapePayload(
    instance: Record<string, any>
  ): Record<string, any> 
  {
    return instance;
  }

  protected async _wrap<
    PayloadType extends PayloadSingle<any> | PayloadMany<any>
  > (
    _data: Partial<RequestData>,
    callback: (data: RequestData) => Promise<LayersReturnType<PayloadType>>, 
    _schemas: Partial<ServiceTaskSchemas> = {},
    mapper: ((data: Record<string, any>) => Record<string, any>) | null = null,
  ) 
  {
    const schemas = this._defaults(_schemas, {
      params: Type.Record(Type.String(), Type.Any()),
      query: Type.Record(Type.String(), Type.Any()),
      body: Type.Record(Type.String(), Type.Any()),
      payloadInstance: Type.Record(Type.String(), Type.Any()),
    });
    const data: RequestData = this._defaults(_data, { params: {}, query: {}, body: {}});

    this._validateRequestParams(data, {
      params: schemas.params,
      query: schemas.query,
      body: schemas.body,
    });
    let result = await callback(data);
    result = this._reshapePayload(result, mapper);
    this._validatePayload(result, schemas.payloadInstance);

    return result;
  }
}
