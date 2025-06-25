import { sql } from 'drizzle-orm';
import { Database, DatabaseConfig } from '@/types/db';


export function buildConnectionUrl(database: DatabaseConfig) {
  return `postgresql://${database.USER}:${database.PASSWORD}@${database.HOST}:${database.PORT}/${database.NAME}`;
}

export async function testConnection(db: Database) {
  return await db.execute(sql`SELECT 1`);
}

export async function clearData(db: Database) {
  // Delete all rows from all tables in the current schema
  await db.execute(sql.raw(`
    -- Generate and execute DELETE statements for all tables in the current schema
    DO $$
    DECLARE
        r RECORD;
    BEGIN
        -- Disable all triggers temporarily to avoid constraint violations
        SET session_replication_role = replica;
        
        FOR r IN 
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = current_schema()
        LOOP
            EXECUTE 'DELETE FROM ' || quote_ident(r.tablename) || ' CASCADE';
            RAISE NOTICE 'Deleted all rows from: %', r.tablename;
        END LOOP;
        
        -- Reset triggers to normal operation
        SET session_replication_role = default;
    END $$;
    
    -- Verify tables are empty
    SELECT tablename, (xpath('/row/cnt/text()', query_to_xml(format('SELECT COUNT(*) AS cnt FROM %I', tablename), false, true, '')))[1]::text::int AS row_count
    FROM pg_tables
    WHERE schemaname = current_schema();
  `));
}