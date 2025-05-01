import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { commonColumns } from "@/models/commons";
import { z } from "zod";
import { buildModel } from "@/models/mixins/models";
import { relations } from "drizzle-orm";

/*******************************************************************************
 * Products Model
 *******************************************************************************/

export const productsModel = buildModel(
  "products", 
  {
    ...commonColumns,
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
export type Product = z.infer<typeof productsModel.schemas.select>;

productsModel.setRelations(({ one, many }) => ({
  cover: one(productImagesModel.table),
  images: many(productImagesModel.table),
}));

/*******************************************************************************
 * Products Images Model
 *******************************************************************************/

export const productImagesModel = buildModel(
  "product_images",
  {
    ...commonColumns,
    productId: pg.integer().notNull().references(() => productsModel.table.id),
    name: pg.varchar({ length: 255 }).notNull(),
    path: pg.varchar({ length: 255 }).notNull(),
  }
);
export type ProductImage = z.infer<typeof productImagesModel.schemas.select>;

productImagesModel.setRelations(({ one }) => ({
  product: one(productsModel.table, {
    fields: [productItemsModel.table.productId],
    references: [productsModel.table.id],
  }),
}))

/*******************************************************************************
 * Products Images Model
 *******************************************************************************/

export const productItemsModel = buildModel(
  "product_items",
  {
    ...commonColumns,
    color: pg.varchar({ length: 255 }).notNull(),
    size: pg.varchar({ length: 255 }).notNull(),
    quantity: pg.integer().notNull(),
    productId: pg.integer().notNull().references(() => productsModel.table.id),
  }
);
export type ProductItem = z.infer<typeof productItemsModel.schemas.select>;