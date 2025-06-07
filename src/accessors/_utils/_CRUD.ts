// @ts-nocheck
import { db } from '@/db';
import lodash from 'lodash';
import { Table } from 'drizzle-orm';
import * as op from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import settings from '@/settings';
import { APIError } from '@/utils/errors';
import { validate } from '@/utils/validator';
import { TSchema } from '@sinclair/typebox';
import cursorPagination from '@/accessors/utils/CursorPagination';
import { OperationReturnType, InputData, LookupIdentifiers } from '@/types/commons';
import { DisplayFields, DisplayFieldsOptions } from '@/utils/accessors/displayFields';

/******************************************************************************
 * Types
 *****************************************************************************/

type ListOptions = DisplayFieldsOptions & {
  fields: [string, "desc" | "asc"][];
  limit: number;
};

/******************************************************************************
 * CRUD Operations Object
 *****************************************************************************/


export const crudOperations = new (class CRUDOperations {

  private _getColumnsFromIdentifiers(table: Table, identifiers: LookupIdentifiers) {
    return Object.entries(identifiers)
      .map(([key, value]) => [
        (key in table) ? table[key as keyof typeof table] : null,
        value
      ])
      .filter(([key, value]) => key !== null && value !== undefined)
  }

  public async create(
    table: Table,
    data: InputData,
    insertSchema: TSchema,
    _options: Partial<DisplayFieldsOptions> = {},
  ): Promise<OperationReturnType>
  {
    const options = lodash.defaults(_options, {
      includeFields: null,
      excludeFields: null,
    }) as DisplayFieldsOptions;

    try {
      const validation = validate(insertSchema, data);
      if (!validation.success) {
        return validation;
      }

      const result = await db
        .insert(table)
        .values(data)
        .returning();

      const displayFields = DisplayFields.toDisplayFields(result, { 
        includeFields: options.includeFields,
        excludeFields: options.excludeFields,
      });
      if (!displayFields.success) {
        return displayFields;
      }

      return {
        success: true,
        data: displayFields.data[0],
      };
    } catch (error) {
      return {
        success: false,
        error: new APIError(500, 'Failed to create record'),
      };
    }
  }

  public async update(
    table: Table,
    identifiers: LookupIdentifiers,
    data: InputData,
    updateSchema: TSchema,
    _options: Partial<DisplayFieldsOptions> = {},
  ): Promise<OperationReturnType> 
  {
    const options = lodash.defaults(_options, {
      includeFields: null,
      excludeFields: null,
    }) as DisplayFieldsOptions;

    try {
      const identifiersArray = this._getColumnsFromIdentifiers(table, identifiers);
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
      const result = await db
        .update(table)
        .set(data)
        .where(op.and(...lookups))
        .returning();

      const displayFields = DisplayFields.toDisplayFields(result, { 
        includeFields: options.includeFields,
        excludeFields: options.excludeFields,
      });
      if (!displayFields.success) {
        return displayFields;
      }

      return {
        success: true,
        data: displayFields.data[0],
      }

    } catch (error) {
      return {
        success: false,
        error: new APIError(500, 'Failed to get record'),
      };
    }
  }

  public async delete(
    table: Table,
    identifiers: LookupIdentifiers,
    _options: Partial<DisplayFieldsOptions> = {},
  ): Promise<OperationReturnType> 
  {
    const options = lodash.defaults(_options, {
      includeFields: null,
      excludeFields: null,
    }) as DisplayFieldsOptions;

    try {
      const identifiersArray = this._getColumnsFromIdentifiers(table, identifiers);
      if (identifiersArray.length === 0) {
        return {
          success: false,
          error: new APIError(400, 'No identifier provided'),
        };
      }

      const lookups = identifiersArray.map(([key, value]) => op.eq(key, value));
      const result = await db
        .delete(table)
        .where(op.and(...lookups))
        .returning();

      const displayFields = DisplayFields.toDisplayFields(result, { 
        includeFields: options.includeFields,
        excludeFields: options.excludeFields,
      });
      if (!displayFields.success) {
        return displayFields;
      }

      return {
        success: true,
        data: displayFields.data[0], 
      }

    } catch (error) {
      return {
        success: false,
        error: new APIError(500, 'Failed to delete record'),
      };
    }
  }

  public async read(
    table: Table,
    identifiers: LookupIdentifiers,
    _options: Partial<DisplayFieldsOptions> = {},
  ): Promise<OperationReturnType> 
  {
    const options = lodash.defaults(_options, {
      includeFields: null,
      excludeFields: null,
    }) as DisplayFieldsOptions;

    try {
      const identifiersArray = this._getColumnsFromIdentifiers(table, identifiers);
      if (identifiersArray.length === 0) {
        return {
          success: false,
          error: new APIError(400, 'No identifier provided'),
        };
      }

      const lookups = identifiersArray.map(([key, value]) => op.eq(key, value));
      const result = await db
        .select()
        .from(table)
        .where(op.and(...lookups))
        .limit(1);

      const displayFields = DisplayFields.toDisplayFields(result, { 
        includeFields: options.includeFields,
        excludeFields: options.excludeFields,
      });
      if (!displayFields.success) {
        return displayFields;
      }

      return {
        success: true,
        data: displayFields.data[0],
      }
    } catch (error) {
      return {
        success: false,
        error: new APIError(500, 'Failed to get record'),
      };
    }
  }

  public async list (
    query: any,
    cursor: string,
    _options: Partial<ListOptions> = {},
  ): Promise<OperationReturnType<{ 
    items: Record<string, any>[], 
    hasMore: boolean, 
    nextCursor: string | null 
  }>> 
  {
    const options = lodash.defaults(_options, {
      fields: [['updatedAt', 'desc'], ['id', 'asc']],
      limit: settings.PAGINATION_DEFAULT_LIMIT,
      includeFields: null,
      excludeFields: null,
    }) as ListOptions;
    try {
      options.limit = (
        typeof options.limit === 'number' && options.limit > 0
        ? options.limit
        : settings.PAGINATION_DEFAULT_LIMIT
      );
      const offsetLimit = options.limit + 1;
      // Decode cursor
      const cursorData = cursorPagination.decodeCursorWithDefaults(cursor);
      if (!cursorData.success) {
        return cursorData as { success: false, error: APIError };
      }
      const cursorProvided = typeof cursor === 'string' && cursor;
      /*
      * Check if the cursor data is consistent with the provided fields.
      * If the cursor data is not consistent with the provided fields,
      * it means that the cursor data is not valid.
      */
      if (
        cursorProvided &&
        options.fields.every(([field, _]) => cursorData.data[field] === undefined)
      ) {
        return {
          success: false,
          error: new APIError(400, 'Cursor decoding is inconsistent with provided fields'),
        };
      }

      const fieldColumns: Record<string, any> = {};
      for (const [field, _] of options.fields) {
        const column = query._.selectedFields[field];
        if (column === undefined) {
          return {
            success: false,
            error: new APIError(400, `Missing field ${field} in query for cursor pagination`),
          };
        }
        fieldColumns[field] = column;
      }

      const orderByItems: op.SQL<any>[] = [];
      for (const [field, direction] of options.fields) {
        orderByItems.push(
          direction === 'asc'
            ? op.asc(sql.raw(`"base_query"."${fieldColumns[field].name}"`))
            : op.desc(sql.raw(`"base_query"."${fieldColumns[field].name}"`))
        );
      }

      const whereStatements: (op.SQL<any> | undefined)[] = [];
      if (cursorProvided) {
        /*
        * After this part is not necessary to check the cursor fields because
        * the cursor data has already been validated before.
        */
        for (const [field, direction] of options.fields) {
          // Different kinds of data types can be checked in 
          // https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-seed/tests/pg/allDataTypesTest/pgSchema.ts
          if (["date", "time", "timestamp"].includes(fieldColumns[field].dataType)) {
            whereStatements.push(
              direction === 'asc'
                ? op.gte(
                  sql.raw(`DATE_TRUNC('milliseconds', "base_query"."${fieldColumns[field].name}")`), 
                  cursorData.data[field]
                )
                : op.lte(
                  sql.raw(`DATE_TRUNC('milliseconds',"base_query"."${fieldColumns[field].name}")`), 
                  cursorData.data[field]
                )
            );
          } else {
            whereStatements.push(
              direction === 'asc'
                ? op.gte(sql.raw(`"base_query"."${fieldColumns[field].name}"`), cursorData.data[field])
                : op.lte(sql.raw(`"base_query"."${fieldColumns[field].name}"`), cursorData.data[field])
            );
          }
        }
      }

      const result = await db
        .select()
        .from(query.as("base_query"))
        .where(op.and(
          ...whereStatements
        ))
        .orderBy(
          ...orderByItems
        )
        .limit(offsetLimit);

      if (result.length < offsetLimit) {
        return {
          success: true,
          data: {
            items: result,
            nextCursor: null,
            hasMore: false,
          },
        }      
      }

      const lastItem = result[result.length - 1];
      const nextCursorMap = options.fields.reduce((acc, [field, _]) => {
        acc[field] = lastItem[field];
        return acc;
      }, {} as Record<string, any>);
      const nextCursor = cursorPagination.generateCursor(nextCursorMap);
      if (!nextCursor.success) {
        return nextCursor as { success: false, error: APIError };
      }

      const displayFields = DisplayFields.toDisplayFields(result.slice(0, -1), { 
        includeFields: options.includeFields,
        excludeFields: options.excludeFields,
      });
      if (!displayFields.success) {
        return displayFields;
      }

      return {
        success: true,
        data: {
          items: displayFields.data,
          nextCursor: nextCursor.data,
          hasMore: true,
        }
      }
    } catch (error) {
      return {
        success: false,
        error: new APIError(500, 'Failed to list records'),
      };
    }
  }

})();

export default crudOperations;
