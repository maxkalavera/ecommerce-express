import { buildMixin } from "@/utils/patterns";
import * as pg from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { buildTarget } from "@/utils/patterns";

/****************************************************************************** 
 * Types
 *****************************************************************************/

export type ModelMixin<
  Table extends pg.PgTableWithColumns<any>,
  SelectSchema extends Record<string, any>,
  InsertSchema extends Record<string, any>,
  UpdateSchema extends Record<string, any>,
> = {
  table: Table;
  schemas: {
    select: SelectSchema;
    insert: InsertSchema;
    update: UpdateSchema;
  }
}

/****************************************************************************** 
 * Mixins
 *****************************************************************************/

export function buildModelMixin<
  Name extends string,
  Columns extends Record<string, any>,
  extraConfig extends (...args: any) => any,
> (
  name: Name, 
  columns: Columns, 
  extraConfig?: extraConfig
) {
  const table = pg.pgTable<Name, Columns>(
    name,
    columns,
    extraConfig,
  );

  const schemas = {
    select: createSelectSchema(table),
    insert: createInsertSchema(table),
    update: createUpdateSchema(table),
  };

  return buildMixin<
    ModelMixin<
      typeof table, 
      typeof schemas.select,
      typeof schemas.insert,
      typeof schemas.update
    >, []
  > ({
    table: table as any,
    schemas: {
      select: schemas.select,
      insert: schemas.insert,
      update: schemas.update,
    },
  });
};
