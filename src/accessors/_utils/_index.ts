// @ts-nocheck
import { Table } from 'drizzle-orm';
import { LookupIdentifiers } from '@/types/commons';

export class CoreAccessor {  
  protected _getColumnsFromIdentifiers(
    table: Table, 
    identifiers: LookupIdentifiers
  ) {
    return Object.entries(identifiers)
      .map(([key, value]) => [
        (key in table) ? table[key as keyof typeof table] : null,
        value
      ])
      .filter(([key, value]) => key !== null && value !== undefined)
  }
}