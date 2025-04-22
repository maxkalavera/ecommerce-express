import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { BuildSchema } from "drizzle-zod";
import { 
  integer, 
  uuid,
} from "drizzle-orm/pg-core";
import { GenericObject } from "@/types/commons";

export const commonColumns = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  key: uuid().defaultRandom().notNull(),
}
