import { TSchema } from '@sinclair/typebox';
import { LayersCore } from '@/utils/layers/LayersCore';
import * as layers from '@/types/layers';
import * as commons from "@/types/commons";


export type RequestData = commons.RequestData;

export type RequestDataSchemas = {
  params: TSchema;
  query: TSchema;
  body: TSchema;
};

export type ServiceTaskSchemas = RequestDataSchemas & {
  payloadInstance: TSchema;
};

export type ServiceSchemas = {
  instance: TSchema;
  insert: TSchema;
  update: TSchema;
  identifiers: TSchema;
  queryParams: TSchema;
};

export type ServiceExecuterHelpers = { 
  buildReturn: LayersCore['buildReturn'];
};

export type ServiceExecuter<
  PayloadType extends layers.PayloadSingle<any> | layers.PayloadMany<any> = 
    layers.PayloadSingle<any> | layers.PayloadMany<any>
> = 
  (data: RequestData, helpers: ServiceExecuterHelpers) => Promise<layers.LayersReturnType<PayloadType>>

export type ServiceExecuters = {
  create: ServiceExecuter<layers.PayloadSingle<any>>;
  update: ServiceExecuter<layers.PayloadSingle<any>>;
  delete: ServiceExecuter<layers.PayloadSingle<any>>;
  read: ServiceExecuter<layers.PayloadSingle<any>>;
  list: ServiceExecuter<layers.PayloadMany<any>>;
};
