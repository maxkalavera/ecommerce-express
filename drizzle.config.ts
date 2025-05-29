import { defineConfig } from 'drizzle-kit';
import settings from './src/settings';

export default defineConfig({
  out: './db/migrations',
  schema: './src/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: settings.DB.URL,
  },
});