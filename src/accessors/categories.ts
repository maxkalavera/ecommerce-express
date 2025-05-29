import { db } from '@/db';
import * as op from 'drizzle-orm';
import { Static } from '@sinclair/typebox';
import lodash from 'lodash';
import { APIError } from '@/utils/errors';
import { CoreAccessor } from '@/accessors/commons';
import { ListCategoriesQueryParameters, CategoryInsert } from '@/typebox/categories';
import { AccessorReturnType } from "@/accessors/utils/types";
import { validate } from '@/utils/validator';
import { categories } from '@/models/categories';



export const categoriesAccessor = new (class CategoriesAccessor extends CoreAccessor {
  public async create(
    data: Static<typeof CategoryInsert>,
  ): Promise<AccessorReturnType<any>> 
  {
    const validation = validate(CategoryInsert, data);
    if (!validation.success) {
      return validation;
    }

    const result = await db.insert(categories).values(data);
    return {
      success: true,
      payload: {
        data: result,
      },
    };
  }

  public async list(
    query: Static<typeof ListCategoriesQueryParameters>
  ): Promise<AccessorReturnType<any>>
  {
    const { cursor, limit, childrenOf } = lodash.defaults(query, {
      cursor: null,
      limit: 5,
      childrenOf: null,
    });

    // Decode cursor
    const cursorData = this.decodeCursorWithDefaults(cursor, { id: null, updatedAt: null });
    if (!cursorData.success) {
      return cursorData as { success: false, error: APIError };
    }

    // Get parent category
    let parentId: number | null = null;
    if (childrenOf) {
      const parentQuery = await db.select()
        .from(categories)
        .where(op.eq(categories.key, childrenOf))
        .limit(1);

      if (!parentQuery.length) {
        return {
          success: false,
          error: new APIError(400, '"childrenOf" category not found'),
        };
      }
      parentId = parentQuery[0]['id'];
    }


    const result = await db.select()
      .from(categories)
      .where(op.and(
        op.or(op.isNull(op.sql`${parentId}::INT`), op.eq(categories.parentId, parentId)),
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

    return {
      success: true,
      payload: {
        items: result,
        ...this.buildCursorAttributes(result, (data) => ({ id: data.id, updatedAt: data.updatedAt }), limit),
      },
    };
  }

})();