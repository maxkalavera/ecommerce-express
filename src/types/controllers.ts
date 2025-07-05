import * as commons from "@/types/commons";
import * as layers from '@/types/layers';

/*
export type PayloadSingle<
  Instance extends Record<string, any>
> = commons.PayloadSingle<Instance>;

export type PayloadMany<
  Instance extends Record<string, any>
> = commons.PayloadMany<Instance>;

export type ControllerReturnType<
  Payload extends PayloadSingle<Instance> | PayloadMany<Instance> = PayloadSingle<any> | PayloadMany<any>,
  Instance extends Record<string, any> = any,
> = commons.LayersReturnType<Payload>;
*/

export type RequestData = commons.RequestData;

export type ControllerExecuters = {
  create: (data: RequestData) => Promise<layers.LayersReturnType<layers.PayloadSingle<any>>>;
  update: (data: RequestData) => Promise<layers.LayersReturnType<layers.PayloadSingle<any>>>;
  delete: (data: RequestData) => Promise<layers.LayersReturnType<layers.PayloadSingle<any>>>;
  read: (data: RequestData) => Promise<layers.LayersReturnType<layers.PayloadSingle<any>>>;
  list: (data: RequestData) => Promise<layers.LayersReturnType<layers.PayloadMany<any>>>;
};