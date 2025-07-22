import * as pg from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { commonColumns,  buildFileColumns, buildTimestamps, buildFileCheckers } from "@/models/commons";
import { categories } from "@/models/categories";

/******************************************************************************
 * Products
 *****************************************************************************/

export const products = pg.pgTable(
  "products",
  {
    // Common columns
    ...commonColumns(),
    // Table specific columns
    name: pg.varchar({ length: 255 }).notNull(),
    description: pg.text().notNull().default(""),
    price: pg.numeric('override_price', { precision: 20, scale: 2 }).notNull().default("0.0"),
    // Color
    color: pg.varchar({ length: 255 }).notNull().default(""),
    colorHex: pg.varchar({ length: 7 }).notNull().default("#000000"),
    // Label
    isLabeled: pg.boolean().default(false),
    labelContent: pg.varchar({ length: 255 }).default(""),
    labelColor: pg.varchar({ length: 7 }).default("#000000"),
    // References
    categoryId: pg.integer().references(() => categories.id, { onDelete: 'restrict' }),
  },
  (table) => [
    pg.check('label_color_hex', sql`${table.labelColor} ~ '^#[0-9a-fA-F]{6}$'`),
    pg.check('color_hex', sql`${table.colorHex} ~ '^#[0-9a-fA-F]{6}$'`),
    pg.check('positive_price', sql`${table.price} >= 0`),
  ]
);

export const productsRelations = relations(
  products,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [products.categoryId],
      references: [categories.id],
    }),
    items: many(productsItems),
    images: many(productsImages),
  })
);

/******************************************************************************
 * Products Images
 *****************************************************************************/

export const productsImages = pg.pgTable(
  "products_images",
  {
    // Common columns
    ...commonColumns(),
    ...buildFileColumns(), 
    // Table specific columns
    isCover: pg.boolean().notNull().default(false),
    // References
    productId: pg.integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  },
  (table) => [
    ...buildFileCheckers(table),
  ]
);

export const productsImagesRelations = relations(
  productsImages,
  ({ one }) => ({
    product: one(products, {
      fields: [productsImages.productId],
      references: [products.id],
    }),
  })
);

/******************************************************************************
 * Products Items
 *****************************************************************************/

export const productsItems = pg.pgTable(
  "products_items",
  {
    // Common columns
    ...commonColumns(),
    // Flags
    isFavorite: pg.boolean().notNull().default(false),
    isOnCart: pg.boolean().notNull().default(false),
    // specific attributes
    quantity: pg.integer().notNull().default(1),
    size: pg.varchar({ length: 255 }).notNull().default(""),
    // References
    productId: pg.integer().notNull().references(() => products.id, { onDelete: 'cascade' }),
  },
  (table) => [
    pg.check('positive_quantity', sql`${table.quantity} >= 0`),
  ]
);

export const productsItemsRelations = relations(
  productsItems,
  ({ one }) => ({
    product: one(products, {
      fields: [productsItems.productId],
      references: [products.id],
    }),
  })
);


