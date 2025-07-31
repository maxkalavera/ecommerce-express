import * as pg from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { commonColumns,  buildFileColumns, buildFileCheckers } from "@/models/commons";
import { urlFriendlyUUID } from "@/utils/drizzle-orm/types/urlFriendlyUUID";
import { users } from "@/models/users";
import { products, productsItems } from "@/models/products";


/******************************************************************************
 * Users
 *****************************************************************************/

export const carts = pg.pgTable(
  "carts",
  {
    // Common columns
    ...commonColumns(),
    // Table specific columns
    userId: pg.integer("user_id").notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
    userKey: urlFriendlyUUID("user_key").notNull().unique().references(() => users.key, { onDelete: 'cascade' }),
  },
  (table) => [
    
  ]
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
    cartId: pg.integer("cart_id").notNull().references(() => carts.id, { onDelete: 'cascade' }),
    cartKey: urlFriendlyUUID("cart_key").notNull().references(() => carts.key, { onDelete: 'cascade' }),
    productItemId: pg.integer("product_item_id").notNull().references(() => productsItems.id, { onDelete: 'cascade' }),
    productItemKey: urlFriendlyUUID("product_item_key").notNull().references(() => productsItems.key, { onDelete: 'cascade' }),
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
    productItem: one(productsItems, {
      fields: [cartsItems.productItemId],
      references: [productsItems.id],
    }),
  })
);
