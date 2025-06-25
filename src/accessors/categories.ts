
import * as op from 'drizzle-orm';
import CoreAccessor from '@/utils/accessors/CoreAccessor';
import { categories, categoriesImages } from '@/models/categories';
import { 
  CategoriesInsert, 
  CategoriesUpdate,
  CategoriesImagesInsert,
  CategoriesImagesUpdate,
} from '@/typebox/accessors/categories';
import { ImageAccessorComposer } from '@/utils/accessors/ImageAccessorComposer';


/*******************************************************************************
 * Categories
 ******************************************************************************/

class CategoriesAccessor extends CoreAccessor {

  constructor () {
    super(
      categories,
      {
        insertSchema: CategoriesInsert,
        updateSchema: CategoriesUpdate,
      }
    );
  }

  protected _buildSelectFields() {
    return {
      ...this.table as any,
      image: {
        ...categoriesImages as any,
      },
    };
  }

  protected _buildBaseQuery (
    queryParams: Record<string, any> = {},
  ) {
    return this.db
     .select(this._buildSelectFields())
     .from(this.table).leftJoin(
      categoriesImages, op.eq(categoriesImages.categoryId, this.table.id));
  }
  
};
export const categoriesAccessor = new CategoriesAccessor();

/*******************************************************************************
 * Categories's Images
 ******************************************************************************/

export class CategoriesImagesAccessor extends CoreAccessor {
  public images = new ImageAccessorComposer(this);

  constructor () {
    super(
      categoriesImages,
      {
        insertSchema: CategoriesImagesInsert,
        updateSchema: CategoriesImagesUpdate,
      }
    );
  }

};
export const categoriesImagesAccessor = new CategoriesImagesAccessor();