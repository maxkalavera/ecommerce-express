import { 
  integer, 
  uuid,
} from "drizzle-orm/pg-core";
import * as pg from "drizzle-orm/pg-core";
import { Table as DrizzleTable } from "drizzle-orm";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { Model as ModelType } from "@/models/types";
import { relations } from 'drizzle-orm';

export const commonColumns = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  key: uuid().defaultRandom().notNull(),
};

export const createSchemas = (table: DrizzleTable) => ({
  select: createSelectSchema(table),
  insert: createInsertSchema(table),
  update: createUpdateSchema(table),
});

export function buildModel<
  TTableName extends string,
  Columns extends Record<string, any>,
  extraConfig extends (...args: any) => any,
> (
  name: TTableName, 
  columns: Columns,
  extraConfig?: extraConfig,
) {
  const table = pg.pgTable(
    name,
    {
      ...commonColumns,
      ...columns
    },
    extraConfig,
  );
  const schemas = createSchemas(table); 


  const tableRelations: any[] = []
  return {
    table: table as any,
    relations: tableRelations,
    schemas: {
      select: schemas.select,
      insert: schemas.insert,
      update: schemas.update,
    },
    addRelations: (relationsParam) => {
      tableRelations.push(relations(table, relationsParam));
    },
  } as ModelType<
    typeof table, 
    typeof schemas.select,
    typeof schemas.insert,
    typeof schemas.update
  >;
};