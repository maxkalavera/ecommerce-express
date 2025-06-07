import { Type } from '@sinclair/typebox';
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-typebox';
import { ListQueryParamaters } from './commons';
import { addSchema } from '@/openapi';
import { categories, categoriesImages } from '@/models/categories';

/******************************************************************************
 * Types
 *****************************************************************************/

export type CategoryType = typeof categories.$inferSelect;

/******************************************************************************
 * Categories Schemas
 *****************************************************************************/

export const ListCategoriesQueryParameters = Type.Composite([
  ListQueryParamaters,
  Type.Object({
    childrenOf: Type.Optional(Type.String({ format: 'base64url' })),
  })
], { additionalProperties: false });

export const Category = Type.Object({
  key: Type.String({ format: 'base64url' }),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});
addSchema(Category, 'Category');

export const CategoryInsert = Type.Object({
  key: Type.Optional(Type.String({ format: 'base64url' })),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  parentKey: Type.Optional(Type.String({ format: 'base64url' })),
});
addSchema(Type.Omit(CategoryInsert, ['key']), 'CategoryInsert');

export const CategoryUpdate = Type.Optional(CategoryInsert);
addSchema(Type.Omit(CategoryUpdate, ['key']), 'CategoryUpdate');

/******************************************************************************
 * Categories images schemas
 *****************************************************************************/

export const CategoryImage = createSelectSchema(categoriesImages);
export const CategoryImageInsert = createInsertSchema(categoriesImages);
export const CategoryImageUpdate = createUpdateSchema(categoriesImages);
