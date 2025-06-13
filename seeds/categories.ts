import fs from 'node:fs/promises';
import fg from 'fast-glob';
import base64url from 'base64url';
import { categoriesAccessor, categoriesImagesAccessor } from '@/accessors/categories';
import categoriesJSON from '@assets/data/categories.json' with { type: 'json' };

export async function seedCategories(tx: any) {
  for (const row of categoriesJSON) {
    const categoryData = {
      ...row,
      key: base64url.encode(row.key),
      parentKey: row.parentKey ? base64url.encode(row.parentKey) : undefined,
    };

    const result = await categoriesAccessor.create(categoryData);
    if (!result.success) {
      throw result.error;
    }

    const images = await fg([`assets/images/categories/${row.key}.{jpg,png}`]);
    if (images.length > 0) {
      const imageBuffer = await fs.readFile(images[0]);
      categoriesImagesAccessor.images.addImage(
        { categoryId: result.payload.data.id }, 
        imageBuffer,
      );
    }
  }
}

export async function seedCategoriesImages(tx: any) {

}