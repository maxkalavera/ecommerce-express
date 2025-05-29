
import { drizzle } from 'drizzle-orm/node-postgres';
import settings from "@/settings"; 
import * as schema from "@/schema";

export const db = drizzle(
  settings.DB.URL, 
  { 
    schema,
    logger: true
  }
);

