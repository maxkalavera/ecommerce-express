import fs from 'node:fs/promises';
import { PgColumn, PgTable } from "drizzle-orm/pg-core";
import fg from 'fast-glob';

export async function resetSerialSequence(db: any, table: PgTable, column: PgColumn) {
  const tableName = (table as any)[Symbol.for('drizzle:Name')];
  await db.execute(`
    SELECT setval(
      pg_get_serial_sequence('${tableName}', '${column.name}'),
      (SELECT MAX(${column.name}) FROM ${tableName})
    );
  `);
}

export async function getFiles (
  domain: string,
  key: string,
  extensions: string[],
) {
  const paths = await getFilesPaths(domain, key, extensions);
  const files = [];
  for (const path of paths) {
    const file = await fs.readFile(path);
    files.push(file);
  }
  return files;
}

export async function getFilesPaths (
  domain: string,
  key: string,
  extensions: string[],
) {  
  return await fg([`assets/images/${domain}/${key}-*.{${extensions.join(',')}}`]);
}