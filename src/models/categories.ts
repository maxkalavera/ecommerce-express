import * as pg from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from 'drizzle-orm';
import { products } from "@/models/products";
import { commonColumns, buildFileColumns, buildTimestamps, buildFileCheckers } from "@/models/commons";
import { urlFriendlyUUID } from "@/utils/drizzle-orm/types/urlFriendlyUUID";

/******************************************************************************
 * Categories Model
 *****************************************************************************/

export const categories: pg.PgTableWithColumns<any> = pg.pgTable(
  "categories",
  {
    // Common columns
    ...commonColumns(),
    // Table specific columns
    name: pg.varchar({ length: 255 }).notNull(),
    description: pg.text().notNull().default(""),
    //parentId: pg.integer().references(() => categories.id, { onDelete: "set null" }),
    parentKey: urlFriendlyUUID().references(() => categories.key, { onDelete: "set null" }),
  },
  (table) => []
);

export const categoriesRelations = relations(
  categories,
  ({ one, many }) => ({
    display: one(categoriesImages),
    products: many(products),
  })
);

/******************************************************************************
 * Categories Images Model
 *****************************************************************************/

export const categoriesImages = pg.pgTable(
  "categories_images",
  {
    // Common columns
    ...buildTimestamps(),
    ...buildFileColumns(),
    // Table specific columns
    categoryId: pg.integer().notNull().references(() => categories.id),
  },
  (table) => [
    ...buildFileCheckers(table),
  ]
);

export const categoriesImagesRelations = relations(
  categoriesImages,
  ({ one }) => ({
    category: one(categories, {
      fields: [categoriesImages.categoryId],
      references: [categories.id],
    }),
  })
);
