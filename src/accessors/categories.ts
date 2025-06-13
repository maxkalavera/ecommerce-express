
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
  CategoryInsert, 
  CategoryUpdate,
  CategoryImageInsert,
  CategoryImageUpdate,

} from '@/typebox/accessors/categories';
import { storeImage, retrieveImage, deleteImage, imageExists } from '@/utils/db/images';
import base64url from '@/utils/base64url';
import { ImageAccessorComposer } from '@/utils/accessors/ImageAccessorComposer';


/*******************************************************************************
 * Categories Accessor
 ******************************************************************************/

class CategoriesAccessor extends CoreAccessor {
  public table = categories;
  public excludeFields: string[] = ['id', 'parentId'];
  protected insertSchema = CategoryInsert;
  protected updateSchema = CategoryUpdate;

  protected async getParentId(parentKey: string) {
    const parent = await db
      .select()
      .from(this.table)
      .where(op.eq(this.table.key, parentKey))
      .execute();
    if (!parent.length) {
      throw new APIError({ code: 400, message: 'Invalid parent key' });
    }
    return parent[0].id;
  }

  protected async _create(
    data: Record<string, any>
  ) {
    const coercedData = this._validateCreateData(data);

    if (coercedData.parentKey) {
      coercedData.parentId = await this.getParentId(coercedData.parentKey);
    }

    const result = await this._executeCreate(coercedData);
    return { data: result };
  }

  protected async _update(
    identifiers: Record<string, any>,
    data: Record<string, any>,
  ) {
    const lookups = this._get_lookups(identifiers);
    const coercedData = this._validateUpdateData(data);

    if (coercedData.parentKey) {
      coercedData.parentId = await this.getParentId(coercedData.parentKey);
    }

    const result = await this._executeUpdate(coercedData, lookups);
    return { data: result };
  }

  protected _buildBaseQuery (
    queryParams: Record<string, any> = {},
  ) {
    return db
     .select(this._buildSelectFields())
     .from(this.table).leftJoin(
      categoriesImages, op.eq(categoriesImages.categoryId, this.table.id));
  }

  protected _buildSelectFields() {
    return {
      ...this.table as any,
      image: {
        ...categoriesImages as any,
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

/*******************************************************************************
 * Categories's Images Accessor
 ******************************************************************************/

export class CategoriesImagesAccessor extends CoreAccessor {
  public table = categoriesImages;
  public excludeFields: string[] = ['id', 'categoryId'];
  protected insertSchema = CategoryImageInsert;
  protected updateSchema = CategoryImageUpdate;
  private domain = 'categories_images';
  public images = new ImageAccessorComposer(this, this.domain);

};

export const categoriesImagesAccessor = new CategoriesImagesAccessor();