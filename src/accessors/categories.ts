
import * as op from 'drizzle-orm';
import CoreAccessor, { type BuildQueryOptions } from '@/utils/accessors/CoreAccessor';
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

  protected buildQuerySelectFields(): Record<string, any> {
    return {
      ...this.table,
      image: {
        ...categoriesImages,
      },
    };
  }

  protected buildQueryBaseSelect() {
    return this.db
     .select(this.buildQuerySelectFields())
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