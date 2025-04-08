import { Accessor } from "@/types/accessors";

export interface Service<
  Model extends { id?: number; key?: string; }, 
  ID=number
> {
  accessor: Accessor<Model, ID>;
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
  create(base: Service<Model, ID>, data: Model): Promise<Model>;
  read(base: Service<Model, ID>, id: ID): Promise<Model | null>;
  readAll(base: Service<Model, ID>): Promise<Model[]>;
  update(base: Service<Model, ID>, id: ID, data: Partial<Model>): Promise<Model | null>;
  delete(base: Service<Model, ID>, id: ID): Promise<boolean>;
}>;