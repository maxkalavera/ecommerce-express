import { PgColumn, PgTable } from "drizzle-orm/pg-core";

export async function resetSerialSequence(db: any, table: PgTable, column: PgColumn) {
  const tableName = (table as any)[Symbol.for('drizzle:Name')];
  await db.execute(`
    SELECT setval(
      pg_get_serial_sequence('${tableName}', '${column.name}'),
      (SELECT MAX(${column.name}) FROM ${tableName})
    );
  `);
}