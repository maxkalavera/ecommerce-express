import 'dotenv/config';
import { db } from "@/db";
import { sql } from 'drizzle-orm';
import { seedCategories } from "@seeds/categories";

/******************************************************************************
 * Seeds
 *****************************************************************************/

await runSeeds(async (tx) => {
   await seedCategories(tx); 
})

/******************************************************************************
 * Utils
 *****************************************************************************/

async function runSeeds (
  ...args: Parameters<(typeof db.transaction)>
) {
  try {
    // Test connection to the database
    await db.execute(sql`SELECT 1`);
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

  } catch (error) {
    console.error('❌ Unable to connect to the database.');
    console.error("Remember that database server should be up and running to seed the database.");
    process.exit(1);
  }
  
  console.log('🌱 Seeding database...');
  try {
    await db.transaction(...args);
  } catch (err) {
    console.error('❌ There was an error seeding values to the database and rolled back:', err);
  }
  
  
  console.log('✅ Database seeded!');
}

