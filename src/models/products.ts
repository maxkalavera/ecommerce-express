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
    // References
    categoryId: pg.integer().notNull().references(() => categories.id, { onDelete: 'restrict' }),
  },
  (table) => []
);

export const productsRelations = relations(
  products,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [products.categoryId],
      references: [categories.id],
    }),
    items: many(productsItems),
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
    // Label
    isLabeled: pg.boolean().notNull().default(false),
    labelContent: pg.varchar({ length: 255 }).notNull().default(""),
    labelColor: pg.varchar({ length: 7 }).notNull().default("#000000"),
    // specific attributes
    price: pg.numeric('override_price', { precision: 20, scale: 2 }).notNull().default("0.0"),
    quantity: pg.integer().notNull().default(1),
    color: pg.varchar({ length: 255 }).notNull().default(""),
    size: pg.varchar({ length: 255 }).notNull().default(""),
    // References
    productId: pg.integer().notNull().references(() => products.id, { onDelete: 'cascade' }),
  },
  (table) => [
    pg.check('positive_quantity', sql`${table.quantity} >= 0`),
    pg.check('positive_price', sql`${table.price} >= 0`),
    pg.check('label_color_hex', sql`${table.labelColor} ~ '^#[0-9a-fA-F]{6}$'`),
  ]
);

export const productsItemsRelations = relations(
  productsItems,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productsItems.productId],
      references: [products.id],
    }),
    images: many(productsItemsImages),
  })
);

/******************************************************************************
 * Products Items Images
 *****************************************************************************/

export const productsItemsImages = pg.pgTable(
  "products_items_images",
  {
    // Common columns
    ...buildTimestamps(),
    ...buildFileColumns(), 
    // Table specific columns
    isCover: pg.boolean().notNull().default(false),
    // References
    productItemId: pg.integer('product_item_id').notNull().references(() => productsItems.id, { onDelete: 'cascade' }),
  },
  (table) => [
    ...buildFileCheckers(table),
  ]
);

export const productsItemsImagesRelations = relations(
  productsItemsImages,
  ({ one }) => ({
    product: one(products, {
      fields: [productsItemsImages.productItemId],
      references: [products.id],
    }),
  })
);
