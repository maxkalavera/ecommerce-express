import * as pg from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { buildIdentifierColumns, buildTimestamps,  buildFileColumns, buildFileCheckers } from "@/models/commons";
import { categories } from "@/models/categories";

/******************************************************************************
 * Products Model
 *****************************************************************************/

export const products = pg.pgTable(
  "products",
  {
    // Common columns
    ...buildIdentifierColumns(),
    ...buildTimestamps(),
    // Table specific columns
    name: pg.varchar({ length: 255 }).notNull(),
    description: pg.text().notNull().default(""),
    // Flags
    isFavorite: pg.boolean().notNull().default(false),
    isOnCart: pg.boolean().notNull().default(false),
    // Label
    isLabeled: pg.boolean().notNull().default(false),
    labelContent: pg.varchar({ length: 255 }).notNull().default(""),
    labelColor: pg.varchar({ length: 7 }).notNull().default("#000000"),
    // specific attributes
    price: pg.numeric('override_price', { precision: 20, scale: 2 }),
    quantity: pg.integer().notNull().default(1),
    color: pg.varchar({ length: 255 }),
    size: pg.varchar({ length: 255 }),
    // References
    categoryId: pg.integer().notNull().references(() => categories.id),
  },
  (table) => [
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
    //items: many(productItems),
  })
);

/******************************************************************************
 * Products Images
 *****************************************************************************/

export const productImages = pg.pgTable(
  "products_images",
  {
    // Common columns
    ...buildIdentifierColumns(),
    ...buildTimestamps(),
    // Table specific columns
    productId: pg.integer().notNull().references(() => products.id),
    ...buildFileColumns(), 
  },
  (table) => [
    ...buildFileCheckers(table),
  ]
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
 * Related products
 *****************************************************************************/

export const relatedProducts = pg.pgTable(
  "products_related",
  {
    // Common columns
    ...buildIdentifierColumns(),
    ...buildTimestamps(),
    // Table specific columns
    productId: pg.integer().notNull().references(() => products.id),
    relatedId: pg.integer().notNull().references(() => products.id),
  },
  (table) => [
    pg.check("related_check1", sql`${table.productId} <> ${table.relatedId}`),
  ]
);

export const relatedProductsRelations = relations(
  relatedProducts,
  ({ one }) => ({
    product: one(products, {
      fields: [relatedProducts.productId],
      references: [products.id],
    }),
    related: one(products, {
      fields: [relatedProducts.relatedId],
      references: [products.id],
    }),
  })
);

/******************************************************************************
 * Products Items
 *****************************************************************************/

/*
export const productItems = pg.pgTable(
  "products_items",
  {
    //...commonColumns,
    ...buildCommonColumns(),
    // Flags
    isFavorite: pg.boolean().notNull().default(false),
    isOnCart: pg.boolean().notNull().default(false),
    // Label
    isLabeled: pg.boolean().notNull().default(false),
    labelContent: pg.varchar({ length: 255 }).notNull().default(""),
    labelColor: pg.varchar({ length: 7 }).notNull().default("#000000"),
    // specific attributes
    price: pg.numeric('override_price', { precision: 20, scale: 2 }),
    quantity: pg.integer().notNull().default(1),
    color: pg.varchar({ length: 255 }),
    size: pg.varchar({ length: 255 }),
    // References
    productId: pg.integer().notNull().references(() => products.id),
  },
  (table) => [
    pg.check("price_check1", sql`${table.price} > 0`),
  ]
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
*/

