import { Accessor } from "@/types/accessors";
import { ID } from "@/types/db";

export type ServiceMethod = (...args: any) => any | Promise<any>;
export type ServiceProperty = 
  | string
  | number
  | boolean
  | null
  | undefined
  | symbol
  | bigint
  | { [key: string | number | symbol]: any };

export interface Service {
  [key: string]: ServiceMethod | ServiceProperty;
};

export interface ModelService<
  Model extends { id?: number; key?: string; }
> extends Service
{
  accessor: Accessor<Model>;
  create(data: Model): Promise<Model>;
  read(id: ID): Promise<Model | null>;
  readAll(): Promise<Model[]>;
  update(id: ID, data: Partial<Model>): Promise<Model | null>;
  delete(id: ID): Promise<boolean>;
};

export type EntryModelService<
  Model extends { id?: number; key?: string; },
  ID=number
> = Partial<{
  create(base: ModelService<Model>, data: Model): Promise<Model>;
  read(base: ModelService<Model>, id: ID): Promise<Model | null>;
  readAll(base: ModelService<Model>): Promise<Model[]>;
  update(base: ModelService<Model>, id: ID, data: Partial<Model>): Promise<Model | null>;
  delete(base: ModelService<Model>, id: ID): Promise<boolean>;
}>;
