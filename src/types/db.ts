import { NodePgDatabase, NodePgClient } from 'drizzle-orm/node-postgres';
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