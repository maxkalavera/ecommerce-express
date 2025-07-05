import * as op from 'drizzle-orm';
import { Table } from 'drizzle-orm';
import { PgSelectDynamic, PgTableWithColumns, SelectedFields } from 'drizzle-orm/pg-core';
import { Type, TSchema, Static } from '@sinclair/typebox';
import { LayersCore } from '@/utils/layers/LayersCore'; 
import { PayloadSingle, PayloadMany, LayersReturnType } from '@/types/layers'
import { Database } from '@/types/db';
import { getDatabase } from '@/db';
import settings from '@/settings';
import { APIError } from '@/utils/errors';
import { validate } from '@/utils/validator';
import { getLookups, LookupsObject } from '@/utils/accessors/lookups';
import { buildCursor, decodeCursor } from '@/utils/accessors/cursorPagination';
import { BaseKeysSchema, BaseQueryParamsSchema } from '@/typebox/accessors/commons'


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

export class CoreAccessor extends LayersCore {
  protected db: Database;
  public table: PgTableWithColumns<any>;
  protected insertSchema: TSchema;
  protected updateSchema: TSchema;
  protected keysSchema: TSchema;
  protected queryParamsSchema: TSchema;

  constructor (
    table: PgTableWithColumns<any>,
    options: Partial<{
      insertSchema: TSchema,
      updateSchema: TSchema,
      keysSchema: TSchema,
      queryParamsSchema: TSchema,
      db: Database
    }> = {}
  ) {
    super();
    this.table = table;
    this.insertSchema = options.insertSchema || Type.Record(Type.String(), Type.Any());
    this.updateSchema = options.updateSchema || Type.Record(Type.String(), Type.Any());
    this.keysSchema = options.keysSchema || BaseKeysSchema;
    this.queryParamsSchema = options.queryParamsSchema || BaseQueryParamsSchema;
    this.db = options.db || getDatabase();
  }

  protected _validateSchema(schema: TSchema, data: Record<string, any>) {
    return validate({
      ...schema,
      additionalProperties: false,
    }, data);
  }

  protected _getColumnsFromkeys(
    table: Table, 
    keys: Record<string, any>,
  ) {
    return Object.entries(keys)
      .map(([key, value]) => [
        (key in table) ? table[key as keyof typeof table] : null,
        value
      ])
      .filter(([key, value]) => key !== null && value !== undefined);
  }

  protected _getLookups(
    keys: Static<typeof this.keysSchema>
  ): LookupsObject 
  {
    this._validateSchema(this.keysSchema, keys as Record<string, any>);
    return getLookups(this.table, keys as Record<string, any>);
  }

  protected _getKeysFromRecord(record: Record<string, any>) {
    return {
      id: record.id
    }
  }

  /****************************************************************************
   * Read operations
   ***************************************************************************/

  protected async _read (
    keys: Static<typeof this.keysSchema>,
  ): Promise<LayersReturnType<PayloadSingle<any>>>
  {
    const lookups = this._getLookups(keys);
    const result: Record<string, any>[] = await this._buildBaseQuery()
      .$dynamic()
      .where(lookups.all)
      .execute();

    return this._buildReturn({
      success: true,
      payload: { data: result[0] } 
    });
  }

  public async read (
    keys: Static<typeof this.keysSchema>
  ): Promise<LayersReturnType<PayloadSingle<any>>> 
  {
    return await this._read(keys);
  }

  /****************************************************************************
   * List operations
   ***************************************************************************/

  protected _buildBaseQuery(
    queryParams: Record<string, any> = {},
  ): PgSelectDynamic<any>
  {
    return this.db
     .select(this._buildSelectFields())
     .from(this.table);
  }

  protected _buildSelectFields (): SelectedFields
  {
    return this.table;
  }

  protected _validateQueryParams(
    queryParams: Static<typeof this.queryParamsSchema>
  ): Record<string, any> 
  {
    this._validateSchema(this.queryParamsSchema, queryParams as Record<string, any>);
    return queryParams as any;
  }

  protected defaultQueryParams = { 
    cursor: "", 
    limit: settings.PAGINATION_DEFAULT_LIMIT 
  }
  protected _defaultQueryParams(
    queryParams: Static<typeof this.queryParamsSchema>
  ) {
    return this._defaults(queryParams, this.defaultQueryParams)
  }

  protected async _list (
    _queryParams: Static<typeof this.queryParamsSchema>,
  ): Promise<LayersReturnType<PayloadMany<any>>>
  {
    let queryParams: Record<string, any> = this._validateQueryParams(_queryParams);
    queryParams = this._defaultQueryParams(queryParams);
    const decodedCursorArtifacts = this._decodeCursorArtifacts(queryParams.cursor, queryParams.limit);
    const baseQuery = this._buildBaseQuery();
    const cursorPaginatedQuery = this._withCursorPagination(baseQuery, decodedCursorArtifacts);
    const result = await cursorPaginatedQuery.execute(queryParams);
    const encodedCursorArtifacts = this._encodeCursorArtifacts(result, decodedCursorArtifacts);
    return this._buildReturn({
      success: true,
      payload: {
        items: result,
        cursor: encodedCursorArtifacts.data.cursor,
        hasMore: encodedCursorArtifacts.data.hasMore,
      }      
    });
  }

  public async list (
    queryParams: Static<typeof this.queryParamsSchema>,
  ): Promise<LayersReturnType<PayloadMany<any>>> 
  {
    return await this._list(queryParams);
  }

  /****************************************************************************
   * Create operations
   ***************************************************************************/

  protected _validateCreateData(
    data: Record<string, any>,
    schema=this.insertSchema
  ): Record<string, any>
  {
    return this._validateSchema(schema, data);
  }

  protected async _executeCreate(
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    const result = await this.db
      .insert(this.table)
      .values(data)
      .returning();
    return result[0];
  }

  protected async _create(
    data: Record<string, any>,
  ): Promise<LayersReturnType<PayloadSingle<any>>> 
  {
    const coercedData = this._validateCreateData(data);
    const mutatedRecord = await this._executeCreate(coercedData);
    const readKeys = this._getKeysFromRecord(mutatedRecord);
    const payload = await this.read(readKeys);
    return payload;
  }

  public async create (
    data: Record<string, any>,
  ): Promise<LayersReturnType<PayloadSingle<any>>> 
  {
    return await this._create(data);
  }

  /****************************************************************************
   * Update operations
   ***************************************************************************/

  protected _validateUpdateData(
    data: Record<string, any>,
    schema=this.updateSchema,
  ): Record<string, any>
  {
    return this._validateSchema(schema, data);
  }

  protected async _executeUpdate(
    data: Record<string, any>,
    lookups: LookupsObject,
  ) {
    const result = await this.db
      .update(this.table)
      .set(data)
      .where(lookups.all)
      .returning();

  return result[0];
  }

  protected async _update(
    keys: Static<typeof this.keysSchema>,
    data: Record<string, any>,
  ): Promise<LayersReturnType<PayloadSingle<any>>>
  {
    const lookups = this._getLookups(keys);
    const coercedData = this._validateUpdateData(data);
    const mutatedRecord = await this._executeUpdate(coercedData, lookups);
    const readKeys = this._getKeysFromRecord(mutatedRecord);
    const payload = await this.read(readKeys);
    return payload;
  }

  public async update (
    keys: Static<typeof this.keysSchema>,
    data: Record<string, any>,
  ): Promise<LayersReturnType<PayloadSingle<any>>> 
  {
    return await this._update(keys, data);
  }

  /****************************************************************************
   * Delete operations
   ***************************************************************************/

  protected async _executeDelete (
    lookups: LookupsObject,
  ) {
    const result = await this.db
      .delete(this.table)
      .where(lookups.all)
      .returning();

    if (result.length === 0) {
      throw new APIError({ code: 404, message: 'Record not found' });
    }
    return result[0];
  }

  protected async _delete (
    keys: Static<typeof this.keysSchema>,
  ): Promise<LayersReturnType<PayloadSingle<any>>> 
  {
    const lookups = this._getLookups(keys);
    const mutatedRecord = await this._executeDelete(lookups);
    const readKeys = this._getKeysFromRecord(mutatedRecord);
    const payload = await this.read(readKeys);
    return payload;
  }

  public async delete (
    keys: Static<typeof this.keysSchema>,
  ): Promise<LayersReturnType<PayloadSingle<any>>> 
  {
    return await this._delete(keys);
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
        this._validateSchema(this.cursorDataSchema, cursorData);
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
        this._validateSchema(this.cursorDataSchema, cursorData);
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