import { Type } from '@sinclair/typebox';
import { categories, categoriesImages } from '@/models/categories';

/******************************************************************************
 * Categories schemas
 *****************************************************************************/

export const CategoryInsert = Type.Object({
    // Core fields
    id: Type.Optional(Type.Integer()),
    key: Type.Optional(Type.String({ format: 'base64url' })),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String()),

    name: Type.String({ maxLength: 255 }),
    description: Type.String(),
    parentId: Type.Optional(Type.Integer()),
    parentKey: Type.Optional(Type.String({ format: 'base64url' })),
});

export const CategoryUpdate = Type.Partial(CategoryInsert);

/******************************************************************************
 * Categories images schemas
 *****************************************************************************/

export const CategoryImageInsert = Type.Object({
  // Core fields
  id: Type.Optional(Type.Integer()),
  key: Type.Optional(Type.String({ format: 'base64url' })),
  createdAt: Type.Optional(Type.String()),
  updatedAt: Type.Optional(Type.String()),

  // Table specific fields
  categoryId: Type.Integer(),
  url: Type.String({ maxLength: 255 }),
  mimetype: Type.Union([Type.String({ maxLength: 255 }), Type.Null()]),
});

export const CategoryImageUpdate = Type.Partial(CategoryImageInsert);
