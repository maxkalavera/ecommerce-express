import { Type } from '@sinclair/typebox';
import { ListQueryParamaters } from './commons';
import { addSchema } from '@/openapi';
import { categories } from '@/models/categories';

/******************************************************************************
 * Types
 *****************************************************************************/

export type CategoryType = typeof categories.$inferSelect;

/******************************************************************************
 * Schemas
 *****************************************************************************/

export const ListCategoriesQueryParameters = Type.Composite([
  ListQueryParamaters,
  Type.Object({
    childrenOf: Type.Optional(Type.String({ format: 'uuid' })),
  })
], { additionalProperties: false });

export const Category = Type.Object({
  key: Type.String({ format: 'uuid' }),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  parentKey: Type.Union([Type.String({ format: 'uuid' }), Type.Literal('')]),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});
addSchema(Category, 'Category');

export const CategoryInsert = Type.Object({
  name: Type.String(),
  description: Type.Optional(Type.String()),
  parentKey: Type.Optional(Type.String({ format: 'uuid' })),
});
addSchema(CategoryInsert, 'CategoryInsert');

export const CategoryUpdate = Type.Optional(CategoryInsert);
addSchema(CategoryUpdate, 'CategoryUpdate');