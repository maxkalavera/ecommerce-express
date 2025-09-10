import { NodePgDatabase, NodePgClient, NodePgTransaction } from 'drizzle-orm/node-postgres';
import * as schema from "@/schema";

export interface DatabaseConfig {
  HOST: string;
  NAME: string;
  PORT: number;
  USER: string;
  PASSWORD: string;
}

export type Database = NodePgDatabase<typeof schema> & {
  $client: NodePgClient;
};

export type Transaction = NodePgTransaction<Record<string, any>, Record<string, any>>;

export type DBConnection = Database | Transaction;
