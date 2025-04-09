import { Accessor } from "@/types/accessors";
import { ID } from "@/types/db";

type ServiceTargetFunction = (...args: any) => any | Promise<any>;

export interface Service<
  Model extends { id?: number; key?: string; }
> {
  accessor: Accessor<Model>;
  create(data: Model): Promise<Model>;
  read(id: ID): Promise<Model | null>;
  readAll(): Promise<Model[]>;
  update(id: ID, data: Partial<Model>): Promise<Model | null>;
  delete(id: ID): Promise<boolean>;
};

export type EntryService<
  Model extends { id?: number; key?: string; },
  ID=number
> = Partial<{
  middleware: (
    target: ServiceTargetFunction, 
    parameters: Parameters<ServiceTargetFunction>
  ) => ReturnType<ServiceTargetFunction> extends Promise<any> ? 
    Promise<ReturnType<ServiceTargetFunction>> : 
    ReturnType<ServiceTargetFunction>;
  create(base: Service<Model>, data: Model): Promise<Model>;
  read(base: Service<Model>, id: ID): Promise<Model | null>;
  readAll(base: Service<Model>): Promise<Model[]>;
  update(base: Service<Model>, id: ID, data: Partial<Model>): Promise<Model | null>;
  delete(base: Service<Model>, id: ID): Promise<boolean>;
}>;
