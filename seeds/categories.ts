import base64url from 'base64url';
import { categoriesAccessor } from '@/accessors/categories';
import categoriesJSON from '@assets/data/categories.json' with { type: 'json' };

export async function seedCategories(tx: any) {
  const categories = categoriesJSON.map(row => ({
    ...row,
    key: base64url.encode(row.key),
    parentKey: row.parentKey ? base64url.encode(row.parentKey) : undefined,
  }));
  console.log('categories', categories);
  for (const category of categories) {
    const result = await categoriesAccessor.create(category as any);
    if (!result.success) {
      throw result.error;
    }
  }
}