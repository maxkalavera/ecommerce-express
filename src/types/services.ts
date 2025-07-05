import { TSchema } from '@sinclair/typebox';
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

export type ServiceExecuters = {
  create: (data: RequestData) => Promise<layers.LayersReturnType<layers.PayloadSingle<any>>>;
  update: (data: RequestData) => Promise<layers.LayersReturnType<layers.PayloadSingle<any>>>;
  delete: (data: RequestData) => Promise<layers.LayersReturnType<layers.PayloadSingle<any>>>;
  read: (data: RequestData) => Promise<layers.LayersReturnType<layers.PayloadSingle<any>>>;
  list: (data: RequestData) => Promise<layers.LayersReturnType<layers.PayloadMany<any>>>;
};
