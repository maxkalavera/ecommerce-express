import * as pg from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { commonColumns,  buildFileColumns, buildFileCheckers } from "@/models/commons";
import { orders } from "@/models/orders";
import { carts } from "@/models/carts";


/******************************************************************************
 * Users
 *****************************************************************************/

export const users = pg.pgTable(
  "users",
  {
    // Common columns
    ...commonColumns(),
    // Table specific columns
    username: pg.varchar({ length: 255 }).notNull().unique(),
    email: pg.varchar({ length: 255 }).notNull().unique(),
    password: pg.varchar({ length: 255 }).notNull(),
  },
  (table) => []
);

export const usersRelations = relations(
  users,
  ({ one }) => ({
    orders: one(orders),
    cart: one(carts),
  })
);
