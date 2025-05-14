import { Resolve } from "@/types/utils";
import { TSchema } from "@sinclair/typebox";
import { Table as DrizzleTable } from "drizzle-orm";
import { TableRelationsHelpers, Relation, Relations } from "drizzle-orm/relations";


export type Model<
  TTable extends DrizzleTable = DrizzleTable,
> = Resolve<{
  table: TTable;
  relations: Relations<any, any>[];
  schemas: {
    select: TSchema;
    insert: TSchema;
    update: TSchema;
  },
  addRelations: <
    TRelations extends Record<any, Relation<any>> = Record<any, Relation<any>>
  > (
    relationsParam: (helpers: TableRelationsHelpers<any>) => TRelations
  ) => void;
}>;