import * as pg from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { urlFriendlyUUID } from "@/utils/drizzle-orm/types/urlFriendlyUUID";
import { toPostgreSQLRegex, URL_REGEX } from "@/utils/regex";


/**
 * Common columns are wrapped in a function to avoid issues with 'this' references in drizzle-orm.
 * When columns are defined directly as an object, drizzle-orm may encounter problems with 'this' binding
 * during schema compilation. Using a function ensures proper scoping and prevents these reference errors.
 */
/*
export const buildCommonColumns = () => {
  return {
    id: op.serial("id").primaryKey().notNull(),
    key: urlFriendlyUUID("key").default(sql`gen_random_uuid()`).unique().notNull(),
    createdAt: op.timestamp("created_at").notNull().defaultNow(),
    updatedAt: op.timestamp("updated_at").notNull().defaultNow(),
  };
};
*/

export const buildIdentifierColumns = () => {
  return {
    id: pg.serial("id").primaryKey().notNull(),
    key: urlFriendlyUUID("key").default(sql`gen_random_uuid()`).unique().notNull(),
  };
}

export const buildTimestamps = () => {
  return {
    createdAt: pg.timestamp("created_at").notNull().defaultNow(),
    updatedAt: pg.timestamp("updated_at").notNull().defaultNow(),
  };
}

export const buildFileColumns = () => {
  return {
    url: pg.varchar({ length: 255 }).notNull(),
    mimetype: pg.varchar({ length: 255 }),
  };
}

export const buildFileCheckers = (table: Record<string, any>) => {
  return [
    pg.check(
      "file_url_check1",
      sql`${table.url} ~ ${toPostgreSQLRegex(URL_REGEX)}`),
  ]
}

export const commonColumns = () => {
  return {
    ...buildIdentifierColumns(),
    ...buildTimestamps(),
  };
}