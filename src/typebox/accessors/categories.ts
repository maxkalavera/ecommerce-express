import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-typebox';
import { categories, categoriesImages } from '@/models/categories';

/******************************************************************************
 * Categories schemas
 *****************************************************************************/

export const Category = createSelectSchema(categories);
export const CategoryInsert = createInsertSchema(categories);
export const CategoryUpdate = createUpdateSchema(categories);

/******************************************************************************
 * Categories images schemas
 *****************************************************************************/

export const CategoryImage = createSelectSchema(categoriesImages);
export const CategoryImageInsert = createInsertSchema(categoriesImages);
export const CategoryImageUpdate = createUpdateSchema(categoriesImages);
