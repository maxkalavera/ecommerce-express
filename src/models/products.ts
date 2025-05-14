import * as pg from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { buildModel } from "@/models/utils/utils";

/******************************************************************************
 * Products Model
 *****************************************************************************/

export const productsModel = buildModel(
  "products", 
  {
    name: pg.varchar({ length: 255 }).notNull(),
    price: pg.numeric({ precision: 20, scale: 2 }).notNull(),
    description: pg.text().notNull().default(""),
    isFavorite: pg.boolean().notNull().default(false),
    isOnCart: pg.boolean().notNull().default(false),
    isLabeled: pg.boolean().notNull().default(false),
    labelContent: pg.varchar({ length: 255 }).notNull().default(""),
    labelColor: pg.varchar({ length: 7 }).notNull().default("#000000"),
  },
  (table) => [
    pg.check("price_check1", sql`${table.price} > 0`),
    pg.check("labelColor_check1", sql`${table.labelColor} ~ '^#[0-9a-f]{6}$'`),
  ]
);

/******************************************************************************
 * Products Model
 *****************************************************************************/

export const productImagesModel = buildModel(
  "products_images",
  {
    productId: pg.integer().notNull().references(() => productsModel.table.id),
    name: pg.varchar({ length: 255 }).notNull(),
    path: pg.varchar({ length: 255 }).notNull(),
  }
);

productImagesModel.addRelations(({ one }) => ({
  product: one(productsModel.table, {
    fields: [productItemsModel.table.productId],
    references: [productsModel.table.id],
  }),
}));

productsModel.addRelations(({ one, many }) => ({
  cover: one(productImagesModel.table),
  images: many(productImagesModel.table),
}));

/******************************************************************************
 * Products Model
 *****************************************************************************/

export const productItemsModel = buildModel(
  "products_images",
  {
    productId: pg.integer().notNull().references(() => productsModel.table.id),
    name: pg.varchar({ length: 255 }).notNull(),
    path: pg.varchar({ length: 255 }).notNull(),
  }
);

productsModel.addRelations(({ one }) => ({
  product: one(productsModel.table),
}));

productsModel.addRelations(({ many }) => ({
  items: many(productImagesModel.table),
}));