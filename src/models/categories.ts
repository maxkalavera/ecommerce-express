import * as pg from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from 'drizzle-orm';
import { products } from "@/models/products";
import { commonColumns } from "@/models/utils";

export const categories: pg.PgTableWithColumns<any> = pg.pgTable(
  "categories",
  {
    ...commonColumns,
    name: pg.varchar({ length: 255 }).notNull(),
    description: pg.text().notNull().default(""),
    parentId: pg.integer().references(() => categories.id, { onDelete: "set null" }),
    //parentKey: pg.varchar({ length: 36 }).notNull().default(""),
  },
  (table) => [
    //pg.check('parent_key_format', sql`${table.parentKey} ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' OR "parentKey" = ''`)
  ]
);

export const categoriesRelations = relations(
  categories,
  ({ one }) => ({
    product: one(products),
  })
);
