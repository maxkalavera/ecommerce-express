import { db, Database } from '@/db';
import * as op from 'drizzle-orm';
import { Static } from '@sinclair/typebox';
import lodash from 'lodash';
import { APIError } from '@/utils/errors';
import { ListCategoriesQueryParameters, CategoryInsert } from '@/typebox/categories';
import { AccessorReturnType } from "@/accessors/utils/types";
import { categories } from '@/models/categories';
import { CursorPagination } from '@/accessors/utils/CursorPagination';
import { CoreAccessor } from '@/accessors/common';
import { CRUD } from '@/accessors/utils/CRUD';

export const categoriesAccessor = new (class CategoriesAccessor extends CoreAccessor {
  private pagination;
  private crud;
  public excludeColumns: string[] = ['id', 'parentId'];

  constructor() {
    super();
    this.pagination = new CursorPagination(this);
    this.crud = new CRUD(this, db, categories);
  }

  public async create(
    data: Static<typeof CategoryInsert>,
  ): Promise<AccessorReturnType<any>> 
  {
    const createResult = await this.crud.create(data, CategoryInsert);

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
    const readResult = await this.crud.read(indentifiers);
    
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
    const updateResult = await this.crud.update(indentifiers, data, CategoryInsert);
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
    const deleteResult = await this.crud.delete(indentifiers);
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
    const { cursor, limit, childrenOf } = lodash.defaults(query, 
      { cursor: null, limit: null, childrenOf: null });

    // Decode cursor
    const cursorData = this.pagination.decodeCursorWithDefaults(cursor, { id: null, updatedAt: null });
    if (!cursorData.success) {
      return cursorData as { success: false, error: APIError };
    }

    const result = await db.select()
      .from(categories)
      .where(op.and(
        op.or(op.isNull(op.sql`${childrenOf}::TEXT`), op.eq(categories.parentKey, childrenOf)),
        // Cursor paging filters
        op.and(
          op.or(
            op.isNull(op.sql`${cursorData.data.updatedAt}::TIMESTAMP`),
            op.sql`DATE_TRUNC('milliseconds', ${categories.updatedAt}) <= ${cursorData.data.updatedAt}::TIMESTAMP`
          ),
          op.or(
            op.isNull(op.sql`${cursorData.data.id}::INT`), 
            op.sql`${categories.id} > ${cursorData.data.id}::INT`
          ),
        )
      ))
      .orderBy(op.desc(categories.updatedAt), op.asc(categories.id))
      .limit(limit);

    const cursorAttributes = this.pagination.buildCursorAttributes(
      result, (data) => ({ id: data.id, updatedAt: data.updatedAt }), limit);
    if (!cursorAttributes.success) {
      return cursorAttributes as { success: false, error: APIError };
    }

    return {
      success: true,
      payload: {
        items: result,
        ...cursorAttributes,
      },
    };
  }

})();