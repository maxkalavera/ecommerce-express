import base64url from 'base64url';
import { categoriesAccessor, categoriesImagesAccessor } from '@/accessors/categories';
import categoriesJson from '@assets/fixtures/categories.json' with { type: 'json' };
import categoriesImagesJson from '@assets/fixtures/categories-images.json' with { type: 'json' };
import { getFiles, getFile } from '@/utils/seeds';

export async function seedCategories(tx: any) {
  for (const row of categoriesJson) {
    const categoryData = {
      ...row,
      key: base64url.encode(row.key),
      parentKey: row.parentKey ? base64url.encode(row.parentKey) : undefined,
    };

    const result = await categoriesAccessor.create(categoryData);    
    await result.onSuccess(async (payload) => {
      const imagesData = categoriesImagesJson.filter((item) => item.categoryKey === row.key);
      for (const imageData of imagesData) {
        const image = await getFile('categories', imageData.key);
        await categoriesImagesAccessor.images.addImage(
          { categoryId: payload.data.id }, 
          image,
        );
      }
    });
  }
}
