import * as op from 'drizzle-orm';
import { PgSelectDynamic, PgTableWithColumns } from 'drizzle-orm/pg-core';
import { Type, TSchema } from '@sinclair/typebox';
import { LayersCore } from '@/utils/layers/LayersCore'; 
import { PayloadSingle, PayloadMany, LayersReturnType } from '@/types/layers';
import { Database } from '@/types/db';
import { getDatabase } from '@/db';
import settings from '@/settings';
import { APIError } from '@/utils/errors';
import { buildCursor, decodeCursor } from '@/utils/accessors/cursorPagination';


/******************************************************************************
 * Types
 *****************************************************************************/

type CursorData = Record<string, any>;

export type BuildQueryOptions = {
  usePagination: Boolean;
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
    key: Record<string, any>,
  ): Promise<LayersReturnType<PayloadSingle<any>>>
  {
    const queryResult = await this.buildQuery(key);

    if (queryResult.length > 0) {
      return this.buildReturn({
        success: true,
        payload: { data: queryResult[0] } 
      });
    } else {
      throw this.buildError({
        message: "Resource was not found",
        code: 400
      }, {
        message: "Resource was not found",
      })
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
        message: 'Error found while validating accessor list query parameters',
        code: 400,          
      }, {
        message: 'Error found while validating accessor list query parameters',
        details: queryParamsValidation.errors
      });
    }
    queryParams = queryParamsValidation.data;


    const decodedCursorData = options.usePagination  
      ? this.decodeCursor(queryParams.cursor) 
      : null;
    const queryResult = await this.buildQuery({
      ...queryParams,
      ...decodedCursorData,
    });
    const encodedCursor = options.usePagination 
      ? this.encodeCursor(queryResult, queryParams.limit) 
      : null;

    return this.buildReturn({
      success: true,
      payload: {
        items: queryResult,
        cursor: encodedCursor,
        hasMore: encodedCursor !== null,
      }      
    });
  }

  /****************************************************************************
   * Create operations
   ***************************************************************************/

  /**
   * Executes create operation
   * @param data - Validated data to insert
   */
  protected async executeCreate(
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    const result = await this.db
      .insert(this.table)
      .values(data)
      .returning();
    return result[0];
  }

  /**
   * Creates a new record
   * @param data - Data for new record
   */
  public async create(
    data: Record<string, any>,
  ): Promise<LayersReturnType<PayloadSingle<any>>> 
  {
    const cohersion = this.coherce(this.insertSchema, data);
    if (!cohersion.success) {
      throw this.buildError({
        message: "There was an error validating insert data",
        code: 400,
      }, {
        message: "There was an error validating insert data",
        details: cohersion.errors

      }, {
        
      });
    }

    const mutatedRecord = await this.executeCreate(cohersion.data);
    return await this.read({ id: mutatedRecord.id });
  }

  /****************************************************************************
   * Update operations
   ***************************************************************************/

  /**
   * Executes update operation
   * @param data - Validated update data
   * @param lookups - Lookup conditions to identify record(s)
   */
  protected async executeUpdate(
    key: Record<string, any>,
    data: Record<string, any>,
  ) {
    const result = await this.db
      .update(this.table)
      .set(data)
      .where(op.and(...this.buildKeyQueryWhere(key, { usePagination: false })))
      .returning();

    return result[0];
  }

  public async update(
    key: Record<string, any>,
    data: Record<string, any>,
  ): Promise<LayersReturnType<PayloadSingle<any>>>
  {
    const cohersion = this.coherce(this.updateSchema, data);
    if (!cohersion.success) {
      throw this.buildError({
        message: "There was an error validatin update data",
        code: 400,
      }, {
        message: "There was an error validatin update data",
        details: cohersion.errors
      })
    }
    const mutatedRecord = await this.executeUpdate(key, cohersion.data);
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
    key: Record<string, any>,
  ) {
    const result = await this.db
      .delete(this.table)
      .where(op.and(...this.buildKeyQueryWhere(key, { usePagination: false })))
      .returning();

    if (result.length === 0) {
      throw this.buildError({ code: 404, message: 'Record not found' }, { message: 'Record not found' });
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
    key: Record<string, any>,
  ): Promise<LayersReturnType<PayloadSingle<any>>> 
  {
    const mutatedRecord = await this.executeDelete(key);
    return this.buildReturn({
      success: true,
      payload: { data: mutatedRecord }
    });
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
  ): CursorData | null
  {
    const validCursor = typeof cursor && !!cursor; 
    if (validCursor) {
      const cursorData = decodeCursor(cursor);
      const validation = this.validate(this.cursorDataSchema, cursorData);
      if (!validation.success) {
        throw this.buildError({}, {
          message: 'Cursor decoding is inconsistent with provided fields',
          details: validation.errors,
        });
      }

      return cursorData;
    }

    return null;
  }

  /**
   * Decodes cursor artifacts for pagination
   * 
   * Takes a cursor string and limit, validates and decodes the cursor data for use in pagination queries.
   * 
   * @param cursor - Base64 encoded cursor string containing pagination metadata
   * @param limit - Maximum number of records to return (defaults to paginationLimit)
   * @returns {DecodedCursorArtifacts} Object containing:
   *   - validCursor: Boolean indicating if cursor is valid
   *   - data: Decoded cursor data (empty object if cursor invalid)
   *   - limit: Number of records to return
   * @throws {APIError} If cursor data fails schema validation (400)
   * 
   * @example
   * ```typescript
   * const artifacts = accessor.decodeCursorArtifacts('base64cursor', 10);
   * // Returns: { validCursor: true, data: { id: 1, updatedAt: '2024-01-01' }, limit: 10 }
   * ```
   */
  protected mapCursorData (
    row: Record<string, any>
  ): Record<string, any> 
  {
    return {
      id: row.id,
      updatedAt: row.updatedAt,
    }
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
    queryResult: Record<string, any>[],
    limit: number = this.paginationLimit,
  ): string | null
  {
    if (queryResult.length < limit) {
      return null;
    }
    const cursorItem = queryResult[limit - 1];
    const cursorData = this.mapCursorData(cursorItem);

    const encodeValidation = this.validate(this.cursorDataSchema, cursorData);
    if (!encodeValidation.success) {
      throw new APIError({

      }, {
        message: 'Cursor encoding is inconsistent with provided fields',
        details: encodeValidation.errors,
      });
    }


    return buildCursor(cursorData);
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
    options: BuildQueryOptions
  ) {
    return this.defaults(params, this.defaultQueryParamsObject)
  }

  protected buildQuerySelectFields (
    params: Record<string, any>,
    options: BuildQueryOptions
  ): Record<string, any>
  {
    return this.table;
  }

  protected buildQueryBaseSelect(
    params: Record<string, any>,
    options: BuildQueryOptions
  ): PgSelectDynamic<any>
  {
    return this.db
      .select(this.buildQuerySelectFields(params, options))
      .from(this.table);
  }

  protected hasPaginationQueryParameters (
    params: Record<string, any>,
    options: BuildQueryOptions
  ): boolean
  {
    const validation = this.validate(this.cursorDataSchema, params, { additionalProperties: true });
    return validation.success;
  }

  protected buildPaginationQueryWhere(
    params: Record<string, any>,
    options: BuildQueryOptions
  ): (op.SQL | undefined)[]
  {
    return [
      op.or(
        op.and(
          op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt}) = ${params.updatedAt}`,
          op.sql`${this.table.id} > ${params.id}`,
        ),
        op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt}) < ${params.updatedAt}`,
      )
    ]
  }

  protected buildKeyQueryWhere(
    params: Record<string, any>,
    options: BuildQueryOptions
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
    options: BuildQueryOptions
  ): (op.SQL | undefined)[]
  {
    let filters: (op.SQL | undefined)[] = [];

    filters = filters.concat(this.buildKeyQueryWhere(params, options));
    
    if (
      options.usePagination &&
      this.hasPaginationQueryParameters(params, options)
    ) {
      filters = filters.concat(this.buildPaginationQueryWhere(params, options));
    }

    return filters;
  }

  protected buildQueryHaving(
    params: Record<string, any>,
    options: BuildQueryOptions
  ): (op.SQL | undefined)[]
  {
    return [];
  }

  protected buildQueryGroupBy(
    params: Record<string, any>,
    options: BuildQueryOptions
  ): op.SQL[]
  {
    return [];
  }

  protected buildPaginationQueryOrderBy(
    params: Record<string, any>,
    options: BuildQueryOptions
  ): op.SQL[]
  {
    return [
      op.desc(op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt})`),
      op.asc(this.table.id),
    ];
  }

  protected buildQueryOrderBy(
    params: Record<string, any>,
    options: BuildQueryOptions
  ): op.SQL[]
  {
    let items: op.SQL[] = [];

    if (options.usePagination) {
      items = items.concat(this.buildPaginationQueryOrderBy(params, options))
    }

    return items;
  }

  protected buildQuery(
    params: Record<string, any>,
    _options: Partial<BuildQueryOptions> = {}
  ): PgSelectDynamic<any>
  {
    const options: BuildQueryOptions = this.defaults(_options, {
      usePagination: true,
    } as BuildQueryOptions);
    
    let query = this.buildQueryBaseSelect(params, options)
      .where(op.and(...this.buildQueryWhere(params, options)))
      .groupBy(...this.buildQueryGroupBy(params, options))
      .having(op.and(...this.buildQueryHaving(params, options)))
      .orderBy(...this.buildQueryOrderBy(params, options));

    if (
      options.usePagination && 
      (typeof params.limit === 'number' && params.limit >= 0)
    ) {
      query = query.limit(params.limit)
    }

    if (
      options.usePagination && 
      (typeof params.offset === 'number' && params.offset >= 0)
    ) {
      query = query.offset(params.offset)
    }

    return query;
  }

};


export default CoreAccessor;