import * as op from 'drizzle-orm';
import lodash from 'lodash';
import { Table } from 'drizzle-orm';
import { PgColumn, PgSelectDynamic, PgTableWithColumns, SelectedFields } from 'drizzle-orm/pg-core';
import { Type, TSchema } from '@sinclair/typebox';
import { db } from '@/db';
import settings from '@/settings';
import { APIError } from '@/utils/errors';
import { AccessorReturnType } from "@/types/accessors";
import { validate } from '@/utils/validator';
import { toDisplayFields } from '@/utils/accessors/displayFields';
import { getLookups } from '@/utils/accessors/lookups';
import { buildCursor, decodeCursor } from '@/utils/accessors/cursorPagination';

/******************************************************************************
 * Types
 *****************************************************************************/

type DecodedCursorArtifacts = {
  validCursor: boolean;
  data: Record<string, any>;
  limit: number;
};

/******************************************************************************
 * CoreAccessor
 *****************************************************************************/

export class CoreAccessor {
  protected table: PgTableWithColumns<any> = null as any;
  protected excludeFields: string[] = ['id'];
  protected insertSchema: TSchema = null as any;

  protected _getColumnsFromIdentifiers(
    table: Table, 
    identifiers: Record<string, any>,
  ) {
    return Object.entries(identifiers)
      .map(([key, value]) => [
        (key in table) ? table[key as keyof typeof table] : null,
        value
      ])
      .filter(([key, value]) => key !== null && value !== undefined);
  }

  protected _reshapeMutateResult(
    result: Record<string, any>[]
  ): Record<string, any>[]
  {
    return result;
  }

  protected _reshapeViewResult(
    result: Record<string, any>[]
  ): Record<string, any>[]
  {
    return result;
  }

  /****************************************************************************
   * Create operations
   ***************************************************************************/

  protected async _create(
    data: any,
  ): Promise<any>
  {
    const coercedData = validate(this.insertSchema, data);

    const result = await db
      .insert(this.table)
      .values(coercedData)
      .returning();

    const displayFields = toDisplayFields(result, { excludeFields: this.excludeFields });
    return displayFields[0];
  }

  public async create (
    data: any,
  ): Promise<AccessorReturnType<any>> 
  {
    try {
      return {
        success: true,
        payload: await this._create(data),
      };
    } catch (error) {
      return {
        success: false,
        error: APIError.fromError(
          error, { code: 500, message: 'Failed to create record'}),
      };
    }
  }

  /****************************************************************************
   * Update operations
   ***************************************************************************/

  protected async _update(
    identifiers: Record<string, any>,
    data: Record<string, any>,
  ): Promise<any>
  {
    const lookups = getLookups(this.table, identifiers);
    const coercedData = validate(this.insertSchema, data);

    const result = await db
      .update(this.table)
      .set(coercedData)
      .where(lookups.all)
      .returning();

    const displayFields = toDisplayFields(result, { excludeFields: this.excludeFields });
    return displayFields[0];
  }

  public async update (
    identifiers: Record<string, any>,
    data: Record<string, any>,
  ): Promise<AccessorReturnType<any>> 
  {
    try {
      return {
        success: true,
        payload: await this._update(identifiers, data),
      };
    } catch (error) {
      return {
        success: false,
        error: APIError.fromError(
          error, { code: 500, message: 'Failed to update record'}),
      };
    }
  }

  /****************************************************************************
   * Delete operations
   ***************************************************************************/

  protected async _delete (
    identifiers: Record<string, any>,
  ): Promise<any>
  {
    const lookups = getLookups(this.table, identifiers);

    const result = await db
      .delete(this.table)
      .where(lookups.all)
      .returning();
    
    const displayFields = toDisplayFields(result, { excludeFields: this.excludeFields });
    return displayFields[0];
  }

  public async delete (
    identifiers: Record<string, any>,
  ): Promise<AccessorReturnType<any>> 
  {
    try {
      return {
        success: true,
        payload: await this._delete(identifiers),
      };
    } catch (error) {
      return {
        success: false,
        error: APIError.fromError(
          error, { code: 500, message: 'Failed to update record'}),
      };
    }
  }

  /****************************************************************************
   * Read operations
   ***************************************************************************/

  protected async _read (
    identifiers: Record<string, any>,
  ): Promise<any> 
  {
    const lookups = getLookups(this.table, identifiers);

    const result = await db
      .select()
      .from(this.table)
      .where(lookups.all)
      .execute();

    const displayFields = toDisplayFields(result, { excludeFields: this.excludeFields });
    return displayFields[0];
  }

  public async read (
    identifiers: Record<string, any>,
  ): Promise<AccessorReturnType<any>> 
  {
    try {
      return {
        success: true,
        payload: await this._read(identifiers),
      };
    } catch (error) {
      return {
        success: false,
        error: APIError.fromError(
          error, { code: 500, message: 'Failed to read the record'}),
      };
    }
  }

  /****************************************************************************
   * List operations
   ***************************************************************************/

  protected _buildBaseQuery (
    queryParams: Record<string, any> = {},
  ): PgSelectDynamic<any>
  {
    return db
     .select(this._buildSelectFields())
     .from(this.table);
  }

  protected _buildSelectFields (): SelectedFields
  {
    return this.table;
  }

  protected async _list (
    queryParams: Record<string, any>,
    query: 
      | PgSelectDynamic<any>
      | undefined = undefined,
  ): Promise<{ 
    items: any[],
    cursor: string | null,
    hasMore: boolean,
  }> 
  {
    const { cursor, limit } = lodash.defaults(queryParams, { cursor: "", limit: this.paginationLimit });

    const decodedCursorArtifacts = this._decodeCursorArtifacts(cursor, limit);

    const baseQuery = this._buildBaseQuery()
    const cursorPaginatedQuery = this._withCursorPagination(baseQuery, decodedCursorArtifacts);
    
    const result = await cursorPaginatedQuery.execute(queryParams);

    const encodedCursorArtifacts = this._encodeCursorArtifacts(result, decodedCursorArtifacts);
    return {
      items: result,
      cursor: encodedCursorArtifacts.data.cursor,
      hasMore: encodedCursorArtifacts.data.hasMore,
    };
  }

  public async list (
    queryParams: Record<string, any>,
  ): Promise<AccessorReturnType<any>> 
  {
    try {
      return {
        success: true,
        payload: await this._list(queryParams),
      };
    } catch (error) {
      return {
        success: false,
        error: APIError.fromError(
          error, { code: 500, message: 'Failed to list records'}),
      };
    }
  }

  /****************************************************************************
   * Cursor pagination
   ***************************************************************************/

  protected paginationLimit = settings.PAGINATION_DEFAULT_LIMIT;
  protected cursorDataSchema = Type.Object({
    updatedAt: Type.Union([
      Type.Record(Type.String(), Type.Any()), // When the date is retrived from db is a Date() object
      Type.String({ format: 'date-time' }), // When deciphered from cursor it retrieves a string
    ]),
    id: Type.Number(),
  });

  protected _decodeCursorArtifacts (
    cursor: string,
    limit: number = this.paginationLimit,
  ): DecodedCursorArtifacts
  {
    const validCursor = typeof cursor && !!cursor; 
    if (validCursor) {
      const cursorData = decodeCursor(cursor);
      try {
        validate(this.cursorDataSchema, cursorData);
      } catch (error) {
        throw APIError.overrideError(error, {
          code: 400,
          message: 'Cursor decoding is inconsistent with provided fields'
        });
      }

      return {
        validCursor: true,
        data: cursorData,
        limit,
      };
    }

    return {
      validCursor: false,
      data: {},
      limit,
    };
  }

  protected _getEncodeCursorData (
    row: Record<string, any>
  ): Record<string, any> 
  {
    return {
      id: row.id,
      updatedAt: row.updatedAt,
    }
  }

  protected _encodeCursorArtifacts (
    queryResult: Record<string, any>[],
    decodedCursorArtifacts: DecodedCursorArtifacts,
  ): {
    data: {
      items: Record<string, any>[];
      cursor: string | null;
      hasMore: boolean;
    },

  }  
  {
    const { limit } = decodedCursorArtifacts;
    if (queryResult.length >= limit) {
      const cursorItem = queryResult[limit - 1];
      const cursorData = this._getEncodeCursorData(cursorItem);

      try {
        validate(this.cursorDataSchema, cursorData);
      } catch (error) {
        throw APIError.overrideError(error, {
          code: 400,
          message: 'Cursor encoding is inconsistent with provided fields'
        });
      }

      const cursor = buildCursor(cursorData);
      return {
        data: {
          items: queryResult.slice(0, limit - 1),
          cursor,
          hasMore: true,
        }
      }
    }
    return {
      data: {
        items: queryResult,
        cursor: null,
        hasMore: false,
      }
    };
  }

  protected _getCursorOrderBy(): op.SQL[]
  {
    return [
      op.desc(op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt})`),
      op.asc(this.table.id),
    ];
  }

  /**
   * Gets the ORDER BY clauses for cursor-based pagination
   * 
   * Returns an array of SQL expressions for ordering results in cursor pagination.
   * 
   * Note: When implementing cursor pagination with not unique fields,
   * it's essential to ensure that when the non-unique fields is equal to the one in the pointer
   * use the unique to paginate, but if non-unique values are different just use this non-unique
   * field to paginate.
   *
   * SQL example: 
   * $ WHERE ("updated_at" = $1 and id > $2) OR ("updated_at" < $3)
   * 
   * @returns {op.SQL[]} Array of SQL ORDER BY expressions
   * 
   * @returns {op.SQL[]} Array of SQL ORDER BY expressions
   */
  protected _getCursorQueryWhere (
    cursorArtifacts: DecodedCursorArtifacts,
  ): op.SQL | undefined
  {
    const { validCursor, data } = cursorArtifacts;
    if (validCursor && data) {
      return op.or(
        op.and(
          op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt}) = ${data.updatedAt}`,
          op.sql`${this.table.id} > ${data.id}`,
        ),
        op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt}) < ${data.updatedAt}`,
      );
    }
    return undefined
  }

  protected _withCursorPagination(
    query: PgSelectDynamic<any>,
    decodedCursorArtifacts: DecodedCursorArtifacts,
  ) {
    return query.$dynamic()
      .where(this._getCursorQueryWhere(decodedCursorArtifacts))
      .orderBy(...this._getCursorOrderBy())
      .limit(decodedCursorArtifacts.limit);
  }

};


export default CoreAccessor;