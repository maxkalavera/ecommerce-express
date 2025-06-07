import { Column, Table } from "drizzle-orm";
import * as op from "drizzle-orm";
import { APIError } from "@/utils/errors";

/******************************************************************************
 * Types
 *****************************************************************************/

export type Lookup = {
  column: Column;
  value: any;
  lookup: op.SQL<any>;
};

export type LookupsObject = Record<string, Lookup> & {
  all: op.SQL<any>;
};

/******************************************************************************
 * Utils
 *****************************************************************************/

export function getLookups (
  table: Table, 
  identifiers: Record<string, any>
): LookupsObject
{
  if (Object.keys(identifiers).length === 0) {
    throw new APIError({ code: 400, message: "No identifiers provided"});
  }

  const lookups: Record<string, Lookup> = {};
  for (const [key, value] of Object.entries(identifiers)) {
    if (key in table) {
      const [column, identifierValue] = [table[key as keyof typeof table], value] as [Column, any];
      lookups[key] = {
        column: column,
        value: value,
        lookup: op.eq(column, identifierValue),
      };
    }
  }

  const all = op.and(...Object.values(lookups).map((lookup) => lookup.lookup));

  return {
    ...lookups,
    all: all as any,
  };
}