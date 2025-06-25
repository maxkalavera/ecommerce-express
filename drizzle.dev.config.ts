import { defineConfig } from 'drizzle-kit';
import { getDatabaseUrl } from './src/db';
import settings from './src/settings';

settings.ENV = 'development';

export default defineConfig({
  out: './db/migrations',
  schema: './src/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});