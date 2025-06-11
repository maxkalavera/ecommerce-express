import * as pg from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { products } from "@/models/products";
import { buildCommonColumns } from "@/models/utils";
import { urlFriendlyUUID } from "@/utils/drizzle-orm/types/urlFriendlyUUID";

/******************************************************************************
 * Categories Model
 *****************************************************************************/

export const categories: pg.PgTableWithColumns<any> = pg.pgTable(
  "categories",
  {
    // Common columns
    ...buildCommonColumns(),
    // Table specific columns
    name: pg.varchar({ length: 255 }).notNull(),
    description: pg.text().notNull().default(""),
    parentId: pg.integer().references(() => categories.id, { onDelete: "set null" }),
    parentKey: urlFriendlyUUID().references(() => categories.key, { onDelete: "set null" }),
  },
  (table) => []
);

export const categoriesRelations = relations(
  categories,
  ({ one }) => ({
    product: one(products),
    display: one(categories),
  })
);

/******************************************************************************
 * Categories Images Model
 *****************************************************************************/

export const categoriesImages = pg.pgTable(
  "categories_images",
  {
    // Common columns
    ...buildCommonColumns(),
    // Table specific columns
    categoryId: pg.integer().notNull().references(() => categories.id),
    url: pg.varchar({ length: 255 }).notNull(),
    mimetype: pg.varchar({ length: 255 }),
  }
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