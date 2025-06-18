import * as pg from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { commonColumns,  buildFileColumns, buildFileCheckers } from "@/models/commons";
import { users } from "@/models/users";
import { products } from "@/models/products";


/******************************************************************************
 * Orders
 * In an ecommerce database, an Order represents a customer's complete purchase 
 * transaction. 
 * It includes details about the products purchased, the total amount, shipping 
 * information, payment method, and the user who placed the order. Each order 
 * is associated with a specific user, and it may include multiple items, 
 * each with its own price, quantity, and color.
 *****************************************************************************/

export const orders = pg.pgTable(
  "orders",
  {
    // Common columns
    ...commonColumns(),
    // Table specific columns
    userId: pg.integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
  }
);

export const ordersRelations = relations(
  orders,
  ({ one }) => ({
    user: one(users, {
      fields: [orders.userId],
      references: [users.id],
    }),
  })
);

/******************************************************************************
 * Orders items
 *****************************************************************************/

export const ordersItems = pg.pgTable(
  "orders_items",
  {
    // Common columns
    ...commonColumns(),
    // Table specific columns
    orderId: pg.integer().notNull().references(() => orders.id, { onDelete: 'cascade' }),
    productId: pg.integer().notNull().references(() => products.id, { onDelete: 'cascade' }),
    quantity: pg.integer().notNull(),
    unitPriceAtPurchase: pg.numeric('unit_price_at_purchase', { precision: 20, scale: 2 }).notNull(),
    priceAtPurchase: pg.numeric('price_at_purchase', { precision: 20, scale: 2 }).notNull(),
  },
  (table) => [
    pg.check('orders_items_quantity_check', sql`${table.quantity} >= 0`),
    pg.check('orders_items_price_at_purchase_check', sql`${table.priceAtPurchase} >= 0`),
    pg.check('orders_items_price_at_purchase_gt_zero_check', sql`${table.priceAtPurchase} >= 0`),
  ]
);


export const ordersItemsRelations = relations(
  ordersItems,
  ({ one }) => ({
    order: one(orders, {
      fields: [ordersItems.orderId],
      references: [orders.id],
    }),
    product: one(products, {
      fields: [ordersItems.productId],
      references: [products.id],
    }),
  })
);
