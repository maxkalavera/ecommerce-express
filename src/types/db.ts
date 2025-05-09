import { PgTable, PgDatabase } from "drizzle-orm/pg-core";

export type Database = PgDatabase<any, any, any>;

export type Table = PgTable;