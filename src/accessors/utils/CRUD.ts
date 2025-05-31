import { Table } from 'drizzle-orm';
import { APIError } from '@/utils/errors';
import { validate } from '@/utils/validator';
import { TSchema } from '@sinclair/typebox';
import { CoreAccessor } from '@/accessors/common';
import { OperationReturnType, InputData, LookupIdentifiers } from '@/types/commons';
import { Database } from '@/db';
import * as op from 'drizzle-orm';

export class CRUD {
  private db: Database;
  private parent: CoreAccessor;
  private table: Table;

  constructor(parent: CoreAccessor, db: Database, table: Table) {
    this.parent = parent;
    this.db = db;
    this.table = table;
  }

  private _getColumnsFromIdentifiers(identifiers: LookupIdentifiers) {
    return Object.entries(identifiers)
      .map(([key, value]) => [
        (key in this.table) ? this.table[key as keyof typeof this.table] : null,
        value
      ])
      .filter(([key, value]) => key !== null && value !== undefined)
  }

  public async create(
    data: InputData,
    insertSchema: TSchema,
  ): Promise<OperationReturnType>
  {
    try {
      const displayColumns = this.parent.getDisplayColumns(this.table);
      if (!displayColumns.success) {
        return displayColumns;
      }

      const validation = validate(insertSchema, data);
      if (!validation.success) {
        return validation;
      }

      const result = await this.db
        .insert(this.table)
        .values(data)
        .returning(displayColumns.data);

      return {
        success: true,
        data: result[0],
      };
    } catch (error) {
      return {
        success: false,
        error: new APIError(500, 'Failed to create record'),
      };
    }
  }

  public async read(
    identifiers: LookupIdentifiers,
  ): Promise<OperationReturnType> 
  {
    try {
      const displayColumns = this.parent.getDisplayColumns(this.table);
      if (!displayColumns.success) {
        return displayColumns;
      }

      const identifiersArray = this._getColumnsFromIdentifiers(identifiers);
      if (identifiersArray.length === 0) {
        return {
          success: false,
          error: new APIError(400, 'No identifier provided'),
        };
      }

      const lookups = identifiersArray.map(([key, value]) => op.eq(key, value));
      const result = await this.db
        .select(displayColumns.data)
        .from(this.table)
        .where(op.and(...lookups))
        .limit(1);

      return {
        success: true,
        data: result[0],
      }
    } catch (error) {
      return {
        success: false,
        error: new APIError(500, 'Failed to get record'),
      };
    }
  }

  public async update(
    identifiers: LookupIdentifiers,
    data: InputData,
    updateSchema: TSchema,
  ): Promise<OperationReturnType> 
  {
    try {
      const displayColumns = this.parent.getDisplayColumns(this.table);
      if (!displayColumns.success) {
        return displayColumns;
      }

      const identifiersArray = this._getColumnsFromIdentifiers(identifiers);
      if (identifiersArray.length === 0) {
        return {
          success: false,
          error: new APIError(400, 'No identifier provided'),
        };
      }

      const validation = validate(updateSchema, data);
      if (!validation.success) {
        return validation;
      }

      const lookups = identifiersArray.map(([key, value]) => op.eq(key, value));
      const result = await this.db
        .update(this.table)
        .set(data)
        .where(op.and(...lookups))
        .returning(displayColumns.data);

      return {
        success: true,
        data: result[0],
      }

    } catch (error) {
      return {
        success: false,
        error: new APIError(500, 'Failed to get record'),
      };
    }
  }

  public async delete(
    identifiers: LookupIdentifiers,
  ): Promise<OperationReturnType> 
  {
    try {
      const displayColumns = this.parent.getDisplayColumns(this.table);
      if (!displayColumns.success) {
        return displayColumns;
      }

      const identifiersArray = this._getColumnsFromIdentifiers(identifiers);
      if (identifiersArray.length === 0) {
        return {
          success: false,
          error: new APIError(400, 'No identifier provided'),
        };
      }

      const lookups = identifiersArray.map(([key, value]) => op.eq(key, value));
      const result = await this.db
        .delete(this.table)
        .where(op.and(...lookups))
        .returning(displayColumns.data);

      return {
        success: true,
        data: result[0],
      }

    } catch (error) {
      return {
        success: false,
        error: new APIError(500, 'Failed to get record'),
      };
    }
  }
}