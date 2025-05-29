import { db } from "@/db";
import { PgTransaction } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { seedCategories } from "@/seeds/categories";


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
    await db.execute(sql`SELECT 1`);
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

