import { QueryResult } from "pg";
import { SQL } from 'drizzle-orm';
import { PgTable } from "drizzle-orm/pg-core";

export interface Accessor<
  Model extends { id?: number; key?: string; }, 
  ID=number
> {
  table: PgTable;
  // To automate the creation of the  services,
  // the methods prefixed with "_" will be ignored by the service generator
  create(data: Model): Promise<Model>;
  read(id: ID): Promise<Model | null>;
  readAll(): Promise<Model[]>;
  update(id: ID, data: Partial<Model>): Promise<Model | null>;
  delete(id: ID): Promise<boolean>;
}