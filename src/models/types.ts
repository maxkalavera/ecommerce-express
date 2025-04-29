import { Resolve } from "@/types/commons";
import { Table as DrizzleTable } from "drizzle-orm";
import { BuildSchema } from "drizzle-zod";
import { Schema } from "zod";

export type Model<
  Table extends DrizzleTable = DrizzleTable,
  SelectSchema extends Schema<any> = Schema<any>,
  InsertSchema extends Schema<any> = Schema<any>,
  UpdateSchema extends Schema<any> = Schema<any>,
> = Resolve<{
  table: Table;
  schemas: {
    select: SelectSchema;
    insert: InsertSchema;
    update: UpdateSchema;
  },
}>;