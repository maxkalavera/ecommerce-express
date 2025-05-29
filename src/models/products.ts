import * as pg from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { buildCommonColumns } from "@/models/utils";
import { categories } from "@/models/categories";

/******************************************************************************
 * Products Model
 *****************************************************************************/

export const products = pg.pgTable(
  "products", 
  {
    // Common columns
    ...buildCommonColumns(),
    // Table specific columns
    name: pg.varchar({ length: 255 }).notNull(),
    price: pg.numeric({ precision: 20, scale: 2 }).notNull(),
    description: pg.text().notNull().default(""),
    isFavorite: pg.boolean().notNull().default(false),
    isOnCart: pg.boolean().notNull().default(false),
    isLabeled: pg.boolean().notNull().default(false),
    labelContent: pg.varchar({ length: 255 }).notNull().default(""),
    labelColor: pg.varchar({ length: 7 }).notNull().default("#000000"),
    categoryId: pg.integer().notNull().references(() => categories.id),
  },
  (table) => [
    pg.check("price_check1", sql`${table.price} > 0`),
    pg.check("labelColor_check1", sql`${table.labelColor} ~ '^#[0-9a-f]{6}$'`),
  ]
);

export const productsRelations = relations(
  products,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [products.categoryId],
      references: [categories.id],
    }),
    cover: one(productImages),
    images: many(productImages),
    items: many(productItems),
  })
);

/******************************************************************************
 * Products Model
 *****************************************************************************/

export const productImages = pg.pgTable(
  "products_images",
  {
    // Common columns
    ...buildCommonColumns(),
    // Table specific columns
    productId: pg.integer().notNull().references(() => products.id),
    name: pg.varchar({ length: 255 }).notNull(),
    path: pg.varchar({ length: 255 }).notNull(),
  }
);

export const productImagesRelations = relations(
  productImages,
  ({ one }) => ({
    product: one(products, {
      fields: [productImages.productId],
      references: [products.id],
    }),
  })
);

/******************************************************************************
 * Products Model
 *****************************************************************************/

export const productItems = pg.pgTable(
  "products_images",
  {
    //...commonColumns,
    ...buildCommonColumns(),
    // Table specific columns
    productId: pg.integer().notNull().references(() => products.id),
    name: pg.varchar({ length: 255 }).notNull(),
    path: pg.varchar({ length: 255 }).notNull(),
  }
);

export const productItemsRelations = relations(
  productItems,
  ({ one }) => ({
    product: one(products, {
      fields: [productItems.productId],
      references: [products.id],
    }),
  })
);
