import { buildMixin } from "@/utils/patterns";
import * as pg from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { Model as ModelType } from "@/models/types";
import { relations } from 'drizzle-orm';
import { TableRelationsHelpers, Relation, Relations } from "drizzle-orm/relations";
import { buildTarget } from "@/utils/patterns";

/****************************************************************************** 
 * Mixins
 *****************************************************************************/

export function buildModelMixin<
  TTableName extends string,
  Columns extends Record<string, any>,
  extraConfig extends (...args: any) => any,
> (
  name: TTableName, 
  columns: Columns,
  extraConfig?: extraConfig,
) {
  const table = pg.pgTable<TTableName, Columns>(
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
    ModelType<
      typeof table, 
      typeof schemas.select,
      typeof schemas.insert,
      typeof schemas.update
    >
  > ({
    table: table as any,
    relations: null,
    schemas: {
      select: schemas.select,
      insert: schemas.insert,
      update: schemas.update,
    },
    setRelations: (target, relationsParam) => {
      Object.assign(target, { relations: relations(target.table, relationsParam) });
    },
  });
};

export function buildModel<
  TTableName extends string,
  Columns extends Record<string, any>,
  extraConfig extends (...args: any) => any,
> (
  name: TTableName, 
  columns: Columns,
  extraConfig?: extraConfig
) {
  return buildTarget(
    {}, [
      buildModelMixin<TTableName, Columns, extraConfig> (
        name,
        columns,
        extraConfig
      )
    ]
  );
};