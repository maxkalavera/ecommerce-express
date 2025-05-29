import * as pg from "drizzle-orm/pg-core";
import { customUUID } from "@/utils/drizzle-orm/types/CustomUUID";

export const commonColumns = {
  id: pg.integer("id").primaryKey().notNull(),
  key: customUUID("key").notNull(),
  createdAt: pg.timestamp("created_at").notNull().defaultNow(),
  updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
};