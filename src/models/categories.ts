import { buildModel } from "@/models/utils";
import * as pg from "drizzle-orm/pg-core";
import { productsModel } from "@/models/products";

export const categoriesModel = buildModel(
  "categories",
  {
    productId: pg.integer().notNull().references(() => productsModel.table.id),
    name: pg.varchar({ length: 255 }).notNull(),
    description: pg.text().notNull().default(""),
  },
  (table) => []
);

categoriesModel.addRelations(({ one }) => ({
  product: one(productsModel.table, {
    fields: [categoriesModel.table.productId],
    references: [productsModel.table.id],
  }),
}));

productsModel.addRelations(({ one }) => ({
  category: one(categoriesModel.table),
}));