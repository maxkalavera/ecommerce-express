import 'dotenv/config';
import util from 'node:util';
import { Database } from '@/types/db';
import { getDatabase } from "@/db";
import { testConnection, clearData } from '@/utils/db';
import { seedCategories } from "@seeds/categories";
import { seedUsers } from "@seeds/users";
import { seedProducts } from "@seeds/products";
import { seedCarts } from "@seeds/carts";


/******************************************************************************
 * Seeds
 *****************************************************************************/

await runSeeds(async (tx) => {
  await seedUsers(tx);
  await seedCategories(tx); 
  await seedProducts(tx);
  await seedCarts(tx);
})

/******************************************************************************
 * Utils
 *****************************************************************************/

async function runSeeds (
  ...args: Parameters<Database['transaction']>
) {
  const db = getDatabase();
  try {
    await testConnection(db);
    await clearData(db);
  } catch (error) {
    console.error('❌ Unable to connect to the database.');
    console.error("Remember that database server should be up and running to seed the database.");
    process.exit(1);
  }
  
  console.log('🌱 Seeding database...');

  try {
    await db.transaction(...args);
  } catch (err) {
    console.error('❌ There was an error seeding values to the database and rolled back:', );
    console.log(util.inspect(err, {
      showHidden: false, // show non-enumerable properties
      depth: null, // recurse indefinitely
      colors: true, // ANSI color output
      compact: false, // break into multiple lines
      maxArrayLength: null, // show all array items
      breakLength: Infinity, // don't break long lines
      sorted: true // sort object keys alphabetically
    }));
  }
  
  console.log('✅ Database seeded!');
}

