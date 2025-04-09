import db from "@/db";
import { QueryResult } from "pg";
import { PgTable } from "drizzle-orm/pg-core";
import { sql, SQL } from 'drizzle-orm';
import { Accessor } from "@/types/accessors";


export function buildAccessor<
  Model extends { id?: number; key?: string; }, 
  ID = number
> (
  table: PgTable
): Accessor<Model> {
  return {
    table: table,
    async read(id) {
      const returned = await db.select().from(table).where(sql`${table}.id = ${id}`);
      return returned.length > 0 ? returned[0] as Model : null;
    },
    async readAll() {
      const returned = await db.select().from(table);
      return returned as Model[];
    },
    async create(data) {
      const { id, key, ...insertData } = data;
      const returned = await db.insert(table).values(insertData).returning();
      return returned[0] as Model;
    },
    async update(id, data) {
      const { id: _, key, ...updateData } = data;
      const returned = await db.update(table)
        .set(updateData)
        .where(sql`${table}.id = ${id}`)
        .returning();
      return returned[0] as Model;
    },
    async delete(id) {
      const returned = await db.delete(table)
        .where(sql`${table}.id = ${id}`)
        .returning();
      return returned.length > 0;
    }
  };
}

/*
export const BaseAccessor: Accessor<unknown> = 
{
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
*/
