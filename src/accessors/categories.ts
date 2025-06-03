import { db, Database } from '@/db';
import * as op from 'drizzle-orm';
import { Static } from '@sinclair/typebox';
import lodash from 'lodash';
import { APIError } from '@/utils/errors';
import { ListCategoriesQueryParameters, CategoryInsert } from '@/typebox/categories';
import { AccessorReturnType } from "@/accessors/utils/types";
import { categories } from '@/models/categories';
import { CoreAccessor } from '@/accessors/common';
import cursorPagination from '@/accessors/utils/CursorPagination';
import crudOperations from '@/accessors/utils/CRUD';
import settings from '@/settings';

export const categoriesAccessor = new (class CategoriesAccessor extends CoreAccessor {
  public excludeColumns: string[] = ['id', 'parentId'];

  constructor() {
    super();
  }

  public async create(
    data: Static<typeof CategoryInsert>,
  ): Promise<AccessorReturnType<any>> 
  {
    const displayColumns = this.getDisplayColumns(categories);
    if (!displayColumns.success) {
      return displayColumns;
    }

    const createResult = await crudOperations.create(categories, data, CategoryInsert, displayColumns.data);

    if (!createResult.success) {
      return createResult;
    } else {
      return {
        success: true,
        payload: {
          data: createResult.data,
        },
      };
    }
  }

  public async read(
    indentifiers: { id: string }
  ): Promise<AccessorReturnType<any>> 
  {
    const displayColumns = this.getDisplayColumns(categories);
    if (!displayColumns.success) {
      return displayColumns;
    }
    const readResult = await crudOperations.read(categories, indentifiers, displayColumns.data);
    
    if (!readResult.success) {
      return readResult;
    } else {
      return {
        success: true,
        payload: {
          data: readResult.data,
        },
      };
    }
  }

  public async update(
    indentifiers: { id: string },
    data: Static<typeof CategoryInsert>,
  ): Promise<AccessorReturnType<any>>
  {
    const displayColumns = this.getDisplayColumns(categories);
    if (!displayColumns.success) {
      return displayColumns;
    }

    const updateResult = await crudOperations.update(
        categories, indentifiers, data, CategoryInsert, displayColumns.data);

    if (!updateResult.success) {
      return updateResult;
    } else {
      return {
        success: true,
        payload: {
          data: updateResult.data,
        },
      };
    }
  }

  public async delete(
    indentifiers: { id: string }
  ): Promise<AccessorReturnType<any>>
  {
    const displayColumns = this.getDisplayColumns(categories);
    if (!displayColumns.success) {
      return displayColumns;
    }

    const deleteResult = await crudOperations.delete(
      categories, indentifiers, displayColumns.data);

    if (!deleteResult.success) {
      return deleteResult;
    } else {
      return {
        success: true,
        payload: {
          data: deleteResult.data,
        },
      };
    }
  }

  public async list(
    query: Static<typeof ListCategoriesQueryParameters>
  ): Promise<AccessorReturnType<any>>
  {
    const { cursor, limit, childrenOf }: { 
      cursor: string, 
      limit: number, 
      childrenOf: string | null
    } = lodash.defaults(query, { 
      cursor: "", 
      limit: settings.PAGINATION_DEFAULT_LIMIT, 
      childrenOf: null 
    });
    
    const displayColumns = this.getDisplayColumns(categories);
    if (!displayColumns.success) {
      return displayColumns;
    }

    const basequery = db.select()
      .from(categories)
      .where(
        op.or(op.isNull(op.sql`${childrenOf}::TEXT`), op.eq(categories.parentKey, childrenOf))
      );

    const enhacedQuery = await crudOperations.executeWithCursorPagination(
      basequery, 
      cursor,
      [['updatedAt', 'desc'], ['id', 'asc']],
      limit,
    );
    
    if (!enhacedQuery.success) {
      return enhacedQuery;
    } else {
      return {
        success: true,
        payload: enhacedQuery.data as { items: any[], nextCursor: string | null, hasMore: boolean },
      };
    }
  }

})();