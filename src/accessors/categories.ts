
import * as op from 'drizzle-orm';
import { PgSelectDynamic } from 'drizzle-orm/pg-core';
import lodash, { identity, orderBy } from 'lodash';
import { Static, TSchema } from '@sinclair/typebox';
import { db } from '@/db';
import { APIError } from '@/utils/errors';
import CoreAccessor from '@/utils/accessors/CoreAccessor';
import { AccessorReturnType } from "@/types/accessors";
import { categories, categoriesImages } from '@/models/categories';
import { validate } from '@/utils/validator';
//import { toDisplayFields } from '@/utils/accessors/displayFields';
import { getLookups } from '@/utils/accessors/lookups';
import { 
  ListCategoriesQueryParameters, 
  CategoryInsert, 
  CategoryUpdate,
  CategoryImageInsert,
  CategoryImageUpdate,

} from '@/typebox/categories';

class CategoriesAccessor extends CoreAccessor {
  public table = categories;
  public excludeFields: string[] = ['id', 'parentId'];
  protected insertSchema = CategoryInsert;
  protected updateSchema = CategoryUpdate;

  /*
  async _create(
    data: Static<typeof this.insertSchema> & { parentKey: string | null },
  ) {
    const coercedData = validate(this.insertSchema, data);

    if (coercedData.parentKey) {
      const parent = await db
        .select()
        .from(this.table)
        .where(op.eq(this.table.key, coercedData.parentKey))
        .execute();
      if (!parent.length) {
        throw new APIError({ code: 400, message: 'Invalid parent key' });
      }
      coercedData.parentId = parent[0].id;
    }

    const result = await db
      .insert(this.table)
      .values(coercedData)
      .returning();

    return result[0];
  }
  */

  /*
  protected async _update(
    identifiers: Record<string, any>, 
    data: Record<string, any>
  ): Promise<any> {
    const lookups = getLookups(this.table, identifiers);
    const coercedData = validate(this.insertSchema, data);

    if (coercedData.parentKey) {
      const parent = await db
        .select()
        .from(this.table)
        .where(op.eq(this.table.key, coercedData.parentKey))
        .execute();
      if (!parent.length) {
        throw new APIError({ code: 400, message: 'Invalid parent key' });
      }
      coercedData.parentId = parent[0].id;
    }

    const result = await db
      .update(this.table)
      .set(coercedData)
      .where(lookups.all)
      .returning();

    return result[0];
  }
  */

  protected _buildBaseQuery(
    params: Record<string, any> = {},
  ) {
    return db
     .select(this._buildSelectFields())
     .from(this.table).leftJoin(
      categoriesImages, op.eq(categoriesImages.categoryId, this.table.id));
  }

  protected _buildSelectFields() {
    return {
      id: this.table.id,
      key: this.table.key,
      createdAt: this.table.createdAt,
      updatedAt: this.table.updatedAt,
      description: this.table.updatedAt,
      parentKey: this.table.parentKey,
      image: {
        id: categoriesImages.id,
        createdAt: categoriesImages.createdAt,
        updatedAt: categoriesImages.updatedAt,
        name: categoriesImages.name,
        mimetype: categoriesImages.mimetype,
      },
    };
  }

  protected _getEncodeCursorData(row: Record<string, any>) {
    return {
      updatedAt: row.updatedAt,
      id: row.id,
    };
  }

};
export const categoriesAccessor = new CategoriesAccessor();

export class CategoriesImagesAccessor extends CoreAccessor {
  public table = categoriesImages;
  public excludeFields: string[] = ['id', 'categoryId'];
  protected insertSchema = CategoryImageInsert;
  protected updateSchema = CategoryImageUpdate;
};

export const categoriesImagesAccessor = new CategoriesImagesAccessor();