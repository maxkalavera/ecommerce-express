import { LayersCore } from '@/utils/layers/LayersCore';
import * as commons from "@/types/commons";
import * as layers from '@/types/layers';

export type RequestData = commons.RequestData;

export type ControllerExecuterHelpers = { 
  buildReturn: LayersCore['buildReturn'];
};

export type ServiceExecuter<
  PayloadType extends layers.PayloadSingle<any> | layers.PayloadMany<any> = 
    layers.PayloadSingle<any> | layers.PayloadMany<any>
> = 
  (data: RequestData, helpers: ControllerExecuterHelpers) => Promise<layers.LayersReturnType<PayloadType>>


export type ControllerExecuters = {
  create: ServiceExecuter<layers.PayloadSingle<any>>;
  update: ServiceExecuter<layers.PayloadSingle<any>>;
  delete: ServiceExecuter<layers.PayloadSingle<any>>;
  read: ServiceExecuter<layers.PayloadSingle<any>>;
  list: ServiceExecuter<layers.PayloadMany<any>>;
};
