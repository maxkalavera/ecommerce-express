import * as op from 'drizzle-orm';
import { PgSelectDynamic, PgTableWithColumns } from 'drizzle-orm/pg-core';
import { Type, TSchema } from '@sinclair/typebox';
import { LayersCore } from '@/utils/layers/LayersCore'; 
import { PayloadSingle, PayloadMany, LayersReturnType } from '@/types/layers';
import { Database } from '@/types/db';
import { getDatabase } from '@/db';
import settings from '@/settings';
import { DBConnection } from '@/types/db';
import { buildCursor, decodeCursor } from '@/utils/accessors/CursorPagination';


/******************************************************************************
 * Types
 *****************************************************************************/

type CursorData = Record<string, any>;

export type BuildQueryOptions = {
  usePagination: Boolean;
  maxLimit: number;
};

/******************************************************************************
 * CoreAccessor
 *****************************************************************************/

/**
 * Core accessor class that provides CRUD operations and cursor-based pagination
 * for database tables using Drizzle ORM.
 * 
 * @class CoreAccessor
 * @extends LayersCore
 * 
 * @property {Database} db - Database connection instance
 * @property {PgTableWithColumns<any>} table - Drizzle table object to perform operations on
 * @property {TSchema} insertSchema - JSON schema for validating insert operations
 * @property {TSchema} updateSchema - JSON schema for validating update operations
 * @property {TSchema} keysSchema - JSON schema for validating record keys
 * @property {TSchema} queryParamsSchema - JSON schema for validating query parameters
 * 
 * @example
 * ```typescript
 * class UserAccessor extends CoreAccessor {
 *   constructor() {
 *     super(users, {
 *       insertSchema: UserInsertSchema,
 *       updateSchema: UserUpdateSchema
 *     });
 *   }
 * }
 * ```
 */

export class CoreAccessor extends LayersCore {
  protected db: Database;
  public table: PgTableWithColumns<any>;
  protected insertSchema: TSchema;
  protected updateSchema: TSchema;
  protected keysSchema: TSchema;
  protected queryParamsSchema: TSchema;
    protected paginationLimit = settings.PAGINATION_DEFAULT_LIMIT;

  constructor (
    table: PgTableWithColumns<any>,
    _options: Partial<{
      insertSchema: TSchema,
      updateSchema: TSchema,
      keysSchema: TSchema,
      queryParamsSchema: TSchema,
      db: Database
    }> = {}
  ) {
    super();
    const options = this.defaults(_options, {
      insertSchema: Type.Record(Type.String(), Type.Any()),
      updateSchema: Type.Record(Type.String(), Type.Any()),
      keysSchema: Type.Record(Type.String(), Type.Any()),
      queryParamsSchema: Type.Record(Type.String(), Type.Any()),
      db: getDatabase(),
    });

    this.table = table;
    this.insertSchema = options.insertSchema;
    this.updateSchema = options.updateSchema;
    this.keysSchema = options.keysSchema;
    this.queryParamsSchema = options.queryParamsSchema;
    this.db = options.db;
  }

  /****************************************************************************
   * Read operations
   ***************************************************************************/

  /**
   * Reads a single record by keys
   * @param keys - Keys to identify the record
   */
  public async read (
    params: Record<string, any>,
  ): Promise<LayersReturnType<PayloadSingle<any>>>
  {
    const query = await this.buildQuery(params, { usePagination: false, maxLimit: 1 });
    if (!query.isSuccess()) {
      throw this.buildError({
        sensitive: {
          message: "Error retrieving resource from database",
        }
      });
    }

    const payload = query.getPayload();
    if (payload.items.length > 0) {
      return this.buildReturn({
        success: true,
        payload: { data: payload.items[0] } 
      });
    } else {
      throw this.buildError({
        public: {
          message: "Resource was not found",
          code: 400,
        }, 
        sensitive: {
          message: "Resource was not found",
        }
      });
    }

  }

  /****************************************************************************
   * List operations
   ***************************************************************************/

  /**
   * Lists records with cursor-based pagination
   * @param _query - Query parameters including cursor and limit
   */
  public async list (
    _query: Record<string, any>,
    _options: Partial<{
      usePagination: boolean;
    }> = {},
  ): Promise<LayersReturnType<PayloadMany<any>>>
  {
    const options: {
      usePagination: boolean;
    } = this.defaults(_options, { usePagination: true });

    let queryParams: Record<string, any>;
    queryParams = this.defaultQueryParams(_query, { usePagination: false });
    const queryParamsValidation = this.validate(this.queryParamsSchema, _query);
    if (!queryParamsValidation.success) {
      throw this.buildError({
        public: {
          message: 'Error found while validating accessor list query parameters',
          code: 400,          
        }, 
        sensitive: {
          message: 'Error found while validating accessor list query parameters',
          details: queryParamsValidation.errors
        }
      });
    }
    queryParams = queryParamsValidation.data;

    return await this.buildQuery({
      ...queryParams,
    }, options);
  }

  /****************************************************************************
   * Mutate operations
   ***************************************************************************/

  public async validateData(
    data: Record<string, any>,
    conn: DBConnection = this.db,
  ): Promise<Record<string, any>>
  {
    return data;
  }

  /****************************************************************************
   * Create operations
   ***************************************************************************/

  public async validateCreateData(
    data: Record<string, any>,
    conn: DBConnection = this.db,
  ): Promise<Record<string, any>>
  {
    return data;
  }

  /**
   * Creates a new record
   * @param data - Data for new record
   */
  public async create(
    data: Record<string, any>,
    conn: DBConnection = this.db,
  ): Promise<LayersReturnType<PayloadSingle<any>>> 
  {
    data = await this.validateData(data, conn);
    data = await this.validateCreateData(data, conn);

    const cohersion = this.coherce(this.insertSchema, data);
    if (!cohersion.success) {
      throw this.buildError({
        public: {
          message: "There was an error validating insert data",
          code: 400,
        }, 
        sensitive: {
        message: "There was an error validating insert data",
        details: cohersion.errors
        }
      });
    }

    const mutatedRecord = (
      await conn
        .insert(this.table)
        .values(data)
        .returning()
    )[0];

    return this.buildReturn({
      success: true,
      payload: { data: mutatedRecord } 
    });
    //return await this.read({ id: mutatedRecord.id });
  }

  /****************************************************************************
   * Update operations
   ***************************************************************************/

  public async validateUpdateData(
    params: Record<string, any>,
    data: Record<string, any>,
    conn: DBConnection = this.db,
  ): Promise<Record<string, any>>
  {
    return data;
  }

  /**
   * Updates an existing record
   * @param params - Keys to identify the record
   * @param data - Data to update
   */
  public async update(
    params: Record<string, any>,
    data: Record<string, any>,
    conn: DBConnection = this.db,
  ): Promise<LayersReturnType<PayloadSingle<any>>>
  {
    data = await this.validateData(data, conn);
    data = await this.validateUpdateData(params, data, conn);

    const cohersion = this.coherce(this.updateSchema, data);
    if (!cohersion.success) {
      throw this.buildError({
        public: {
          message: "There was an error validatin update data",
          code: 400,
        }, 
        sensitive: {
          message: "There was an error validatin update data",
          details: cohersion.errors
        }
      })
    }

    const mutatedRecord = (
      await conn
        .update(this.table)
        .set(data)
        .where(op.and(...this.buildKeyQueryWhere(params, { usePagination: false })))
        .returning()
    )[0];
    return await this.read({ id: mutatedRecord.id });
  }

  /****************************************************************************
   * Delete operations
   ***************************************************************************/

  /**
   * Executes a delete operation on the database
   * 
   * @param lookups - Lookup conditions to identify the record(s) to delete
   * @returns Promise resolving to the deleted record
   * @throws {APIError} If record is not found (404)
   * 
   * @example
   * ```typescript
   * const deletedRecord = await executeDelete({
   *   all: eq(table.id, 123)
   * });
   * ```
   */
  protected async executeDelete (
    params: Record<string, any>,
    conn: DBConnection = this.db,
  ) {
    const result = await conn
      .delete(this.table)
      .where(op.and(...this.buildKeyQueryWhere(params, { usePagination: false })))
      .returning();

    if (result.length === 0) {
      throw this.buildError({ 
        public: { code: 404, message: 'Record not found' }, 
        sensitive: { message: 'Record not found' }}
      );
    }
    return result[0];
  }

  /**
   * Deletes a record by its keys and returns the deleted record
   * 
   * @param keys - Keys to identify the record to delete
   * @returns Promise resolving to the deleted record wrapped in a LayersReturnType
   * @throws {APIError} If record is not found (404)
   * 
   * @example
   * ```typescript
   * const deleted = await accessor.delete({ id: 123 });
   * ```
   */
  public async delete (
    params: Record<string, any>,
    conn: DBConnection = this.db,
  ): Promise<LayersReturnType<PayloadSingle<any>>> 
  {
    const mutatedRecord = await this.executeDelete(params, conn);
    return this.buildReturn({
      success: true,
      payload: { data: mutatedRecord }
    });
  }
  
  /****************************************************************************
   * Cursor pagination
   ***************************************************************************/

  /**
   * Schema for validating cursor data structure
   * 
   * Defines the expected shape of cursor data with:
   * - updatedAt: Either a Date object (from DB) or ISO date string (from cursor)
   * - id: Numeric identifier
   * 
   * This schema is used to validate both cursor encoding and decoding operations
   * to ensure data consistency in pagination.
   * 
   * @type {TSchema}
   */
  protected decodeCursor (
    cursor: string,
    cursorDataSchema: TSchema = Type.Record(Type.String(), Type.Any()),
  ): CursorData | null
  {
    const validCursor = typeof cursor && !!cursor; 
    if (validCursor) {
      try {
        const cursorData = decodeCursor(cursor);
        const validation = this.validate(cursorDataSchema, cursorData);
        if (!validation.success) {
          throw this.buildError({
            sensitive: {
              message: 'Cursor decoding is inconsistent with provided fields',
              details: validation.errors,
            }
          });
        }

        return cursorData;
      } catch (error) {
        throw this.buildError({
          public: { code: 400, message: 'Invalid cursor' },
          sensitive: { message: 'Invalid cursor' }
        }, error);
      }
    }

    return null;
  }

  /**
   * Gets the data needed to encode a cursor from a database row
   * 
   * Extracts the necessary fields (id and updatedAt) from a database row to create
   * a cursor for pagination.
   * 
   * @param row - Database record containing at least id and updatedAt fields
   * @returns Object containing id and updatedAt for cursor encoding
   * 
   * @example
   * ```typescript
   * const cursorData = accessor.getEncodeCursorData({
   *   id: 123,
   *   updatedAt: new Date(),
   *   name: 'Test'
   * });
   * // Returns: { id: 123, updatedAt: '2024-01-01T00:00:00.000Z' }
   * ```
   */
  protected encodeCursor (
    data: Record<string, any>,
    cursorDataSchema: TSchema = Type.Record(Type.String(), Type.Any()),
  ): string | null
  {
    const encodeValidation = this.validate(cursorDataSchema, data);
    if (!encodeValidation.success) {
      throw this.buildError({
        sensitive: {
          message: 'Cursor encoding is inconsistent with provided fields',
          details: encodeValidation.errors,
        }
      });
    }

    return buildCursor(data);
  }

  /****************************************************************************
   * Query building methods
   ***************************************************************************/

  protected defaultQueryParamsObject = { 
    cursor: "", 
    limit: settings.PAGINATION_DEFAULT_LIMIT 
  }
  protected defaultQueryParams(
    params: Record<string, any>,
    options: Partial<BuildQueryOptions>
  ) {
    return this.defaults(params, this.defaultQueryParamsObject)
  }

  protected buildQuerySelectFields (
    params: Record<string, any>,
    options: Partial<BuildQueryOptions>
  ): Record<string, any>
  {
    return this.table;
  }

  protected buildQueryBaseSelect(
    params: Record<string, any>,
    options: Partial<BuildQueryOptions>
  ): PgSelectDynamic<any>
  {
    return this.db
      .select(this.buildQuerySelectFields(params, options))
      .from(this.table);
  }

  protected buildKeyQueryWhere(
    params: Record<string, any>,
    options: Partial<BuildQueryOptions>
  ): (op.SQL | undefined)[]
  {
    let filters: (op.SQL | undefined)[] = [];

    if (typeof params.id === 'number') {
      filters.push(op.eq(this.table.id, params.id));
    }

    if (typeof params.key === 'string') {
      filters.push(op.eq(this.table.key, params.key));
    }

    return filters;
  }

  protected buildQueryWhere(
    params: Record<string, any>,
    options: Partial<BuildQueryOptions>
  ): (op.SQL | undefined)[]
  {
    let filters: (op.SQL | undefined)[] = this.buildKeyQueryWhere(params, options);

    if (options.usePagination && params.cursorData !== null) {
      filters = filters.concat(this.buildPaginationQueryWhere(params, options));
    }

    return filters;
  }

  protected buildQueryHaving(
    params: Record<string, any>,
    options: Partial<BuildQueryOptions>
  ): (op.SQL | undefined)[]
  {
    return [];
  }

  protected buildQueryGroupBy(
    params: Record<string, any>,
    options: Partial<BuildQueryOptions>
  ): op.SQL[]
  {
    return [];
  }

  protected buildQueryOrderBy(
    params: Record<string, any>,
    options: Partial<BuildQueryOptions>
  ): op.SQL[]
  {
    let items: op.SQL[] = [];

    if (options.usePagination) {
      items = items.concat(this.buildPaginationQueryOrderBy(params, options))
    }

    return items;
  }

  protected async buildQuery(
    params: Record<string, any>,
    _options: Partial<BuildQueryOptions> = {}
  ): Promise<LayersReturnType<PayloadMany<any>>>
  {
    const options: BuildQueryOptions = this.defaults(_options, {
      usePagination: true,
      maxLimit: settings.MAX_QUERY_LIMIT,
    } as BuildQueryOptions);
    
    if (
      options.usePagination
      && typeof params.cursor === 'string' 
      && params.cursor 
    ) {
      params.cursorData = this.decodeCursor(params.cursor);
    } else {
      params.cursorData = null;
    }

    let query = this.buildQueryBaseSelect(params, options)
      .where(op.and(...this.buildQueryWhere(params, options)))
      .groupBy(...this.buildQueryGroupBy(params, options))
      .having(op.and(...this.buildQueryHaving(params, options)))
      .orderBy(...this.buildQueryOrderBy(params, options));

    if (options.usePagination) {
      const limit = params.limit || this.paginationLimit;
      if (typeof limit === 'number' && limit >= 0) {
        query = query.limit(limit + 1);
      } else {
        query = query.limit(options.maxLimit);
      }

      if (typeof params.offset === 'number' && params.offset >= 0) {
        query = query.offset(params.offset);
      }

      const queryResult = await query;

      let cursor: string | null = null;
      if (queryResult.length >= limit) {
        const cursorItem = queryResult[limit];
        const resultCursorData = this.buildCursorData(cursorItem, params, options);
        cursor = this.encodeCursor(resultCursorData);
      }      
      const items = queryResult.slice(0, limit);
      return this.buildReturn({
        success: true,
        payload: {
          items: items,
          cursor: cursor,
          hasMore: cursor !== null,
        }
      });
    } else {
      query = query.limit(options.maxLimit);
      const queryResult = await query;
      return this.buildReturn({
        success: true,
        payload: {
          items: queryResult,
          hasMore: false,
          cursor: null,
        }
      });
    }
  }

  /*
   * Cursor Pagination query methods
   ****************************************************************************/

  protected buildCursorData (
    row: Record<string, any>,
    params: Record<string, any>,
    options: Partial<BuildQueryOptions>
  ): Record<string, any> 
  {
    return {
      id: row.id,
      updatedAt: row.updatedAt.toISOString(),
    }
  }

  protected buildPaginationQueryOrderBy(
    params: Record<string, any>,
    options: Partial<BuildQueryOptions>
  ): op.SQL[]
  {
    return [
      op.desc(op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt})`),
      op.asc(this.table.id),
    ];
  }

  protected buildPaginationQueryWhere(
    params: Record<string, any>,
    options: Partial<BuildQueryOptions>
  ): (op.SQL | undefined)[]
  {
    const { cursorData: { updatedAt, id }} = params;
    return [
      // Pointer selected is located just at the begining of the next page
      // So the row used as pointer also should be included in the next page
      // for retrieving
      op.or(
        // First remove or filter anything before the cursor value
        op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt}) < ${updatedAt}`,
        // If secondary cursor value is equal, filter using id witch is unique
        // leaving the cursor id value, included in the next page.
        op.and(
          op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt}) = ${updatedAt}`,
          op.sql`${this.table.id} >= ${id}`,
        ),
      )
    ];
  }

};


export default CoreAccessor;