import base64url from 'base64url';
import { categoriesAccessor, categoriesImagesAccessor } from '@/accessors/categories';
import categoriesJson from '@assets/fixtures/categories.json' with { type: 'json' };
import { getFiles } from '@/utils/seeds';

export async function seedCategories(tx: any) {
  for (const row of categoriesJson) {
    const categoryData = {
      ...row,
      key: base64url.encode(row.key),
      parentKey: row.parentKey ? base64url.encode(row.parentKey) : undefined,
    };

    const result = await categoriesAccessor.create(categoryData);
    if (!result.success) {
      throw result.error;
    }

    const images = await getFiles('categories', row.key, ['jpg', 'png']);
    if (images.length > 0) {
      categoriesImagesAccessor.images.addImage(
        { categoryId: result.payload.data.id }, 
        images[0],
      );
    }
  }
}
