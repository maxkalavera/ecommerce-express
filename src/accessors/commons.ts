import db from "@/db";
import { QueryResult } from "pg";
import { SQL } from 'drizzle-orm';
import { Accessor } from "@/types/accessors";

export const BaseAccessor: Accessor<unknown> = {
  //const columns = Object.keys(productsTable).filter(key => key !== '_');
  //const values = columns.map(column => JSON.stringify(data[column as keyof Product]));

    async query(query: SQL): Promise<QueryResult> {
      return await db.execute(query);
    },
    async create(data: unknown): Promise<unknown> {
      throw new Error("Not implemented");
    },
    async read(id: number): Promise<unknown | null> {
      throw new Error("Not implemented");
    },
    async readAll(): Promise<unknown[]> {
      throw new Error("Not implemented");
    },
    async update(id: number, data: unknown): Promise<unknown | null> {
      throw new Error("Not implemented");
    },
    async delete(id: number): Promise<boolean> {
        throw new Error("Not implemented");
    }
}