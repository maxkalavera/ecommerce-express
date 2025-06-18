import * as pg from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { commonColumns,  buildFileColumns, buildFileCheckers } from "@/models/commons";
import { users } from "@/models/users";
import { products } from "@/models/products";


/******************************************************************************
 * Users
 *****************************************************************************/

export const carts = pg.pgTable(
  "carts",
  {
    // Common columns
    ...commonColumns(),
    // Table specific columns
    userId: pg.integer().notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => []
);

export const cartsRelations = relations(
  carts,
  ({ one }) => ({
    user: one(users, {
      fields: [carts.userId],
      references: [users.id],
    }),
  })
);

/******************************************************************************
 * Carts items
 *****************************************************************************/

export const cartsItems = pg.pgTable(
  "carts_items",
  {
    // Common columns
    ...commonColumns(),
    // Table specific columns
    cartId: pg.integer().notNull().references(() => carts.id, { onDelete: 'cascade' }),
    productId: pg.integer().notNull().references(() => products.id, { onDelete: 'cascade' }),
  },
  (table) => []
);

export const cartsItemsRelations = relations(
  cartsItems,
  ({ one }) => ({
    cart: one(carts, {
      fields: [cartsItems.cartId],
      references: [carts.id],
    }),
    product: one(products, {
      fields: [cartsItems.productId],
      references: [products.id],
    }),
  })
);
