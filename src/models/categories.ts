import * as pg from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { products } from "@/models/products";
import { commonColumns } from "@/models/utils";
import { customUUID } from "@/utils/drizzle-orm/types/CustomUUID";

export const categories: pg.PgTableWithColumns<any> = pg.pgTable(
  "categories",
  {
    ...commonColumns,
    name: pg.varchar({ length: 255 }).notNull(),
    description: pg.text().notNull().default(""),
    parentId: pg.integer().references(() => categories.id, { onDelete: "set null" }),
    parentKey: customUUID(),
  },
  (table) => []
);

export const categoriesRelations = relations(
  categories,
  ({ one }) => ({
    product: one(products),
  })
);
