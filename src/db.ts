
import { drizzle } from 'drizzle-orm/node-postgres';
import settings from "@/settings"; 

export const db = drizzle(settings.DB.URL, { logger: true });

