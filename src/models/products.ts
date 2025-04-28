import { sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { commonColumns } from "@/models/commons";
import { z } from "zod";
import { buildModel } from "@/models/commons";

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
    displayImageId: pg.integer().notNull().unique(),
  },
  (table) => [
    pg.check("price_check1", sql`${table.price} > 0`),
    pg.check("labelColor_check1", sql`${table.labelColor} ~ '^#[0-9a-f]{6}$'`),
  ]
);
export type Product = z.infer<typeof productsModel.schemas.select>;

/*******************************************************************************
 * Products Images Model
 *******************************************************************************/

export const productsImagesModel = buildModel(
  "products_images",
  {
    ...commonColumns,
    name: pg.varchar({ length: 255 }).notNull(),
    path: pg.varchar({ length: 255 }).notNull(),
  }
);
export type ProductImage = z.infer<typeof productsImagesModel.schemas.select>;
