import { Resolve } from "@/types/commons";
import { Table as DrizzleTable } from "drizzle-orm";
import { TableRelationsHelpers, Relation, Relations } from "drizzle-orm/relations";
import { Schema } from "zod";

export type Model<
  TTable extends DrizzleTable = DrizzleTable,
  SelectSchema extends Schema<any> = Schema<any>,
  InsertSchema extends Schema<any> = Schema<any>,
  UpdateSchema extends Schema<any> = Schema<any>,
> = Resolve<{
  table: TTable;
  relations: Relations<any, any> | null;
  schemas: {
    select: SelectSchema;
    insert: InsertSchema;
    update: UpdateSchema;
  },
  setRelations: <
    TRelations extends Record<any, Relation<any>> = Record<any, Relation<any>>
  > (
    relationsParam: (helpers: TableRelationsHelpers<any>) => TRelations
  ) => void;
}>;