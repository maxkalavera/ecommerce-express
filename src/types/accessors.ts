import { QueryResult } from "pg";
import { SQL } from 'drizzle-orm';

export interface Accessor<Module, ID=number> {
  query(query: SQL): Promise<QueryResult>;
  create(data: Module): Promise<Module>;
  read(id: ID): Promise<Module | null>;
  readAll(): Promise<Module[]>;
  update(id: ID, data: Module): Promise<Module | null>;
  delete(id: ID): Promise<boolean>;
}