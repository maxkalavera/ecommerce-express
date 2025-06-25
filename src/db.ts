
import { drizzle } from 'drizzle-orm/node-postgres';
import { Database, DatabaseConfig } from '@/types/db';
import { buildConnectionUrl } from '@/utils/db';
import settings from "@/settings"; 
import * as schema from "@/schema";


export function getDatabaseConfig(): DatabaseConfig {
  if (settings.ENV === "testing") {
    return settings.TESTING_DATABASE;
  }
  return settings.DATABASE;
}

export function getDatabaseUrl(config: DatabaseConfig | null = null) {
  if (config === null) {
    return buildConnectionUrl(getDatabaseConfig());
  }
  return buildConnectionUrl(config);
}

let dbInstance: Database;
let cacheUrl: string | null = null;
export function getDatabase(config: DatabaseConfig | null = null) {
  const databaseUrl = getDatabaseUrl(config);

  if (cacheUrl !== databaseUrl) {
    cacheUrl = databaseUrl;
    dbInstance = drizzle(databaseUrl, {
      schema,
      logger: settings.ENV === 'development' 
        ? true 
        : false,
    });
  }
  return dbInstance;
}