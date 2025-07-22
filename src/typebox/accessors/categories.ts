import { Type } from '@sinclair/typebox';
import { categories, categoriesImages } from '@/models/categories';
import { BaseSchema } from '@/typebox/accessors/commons';

/******************************************************************************
 * Categories schemas
 *****************************************************************************/

export const CategoriesInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    name: Type.String({ maxLength: 255 }),
    description: Type.String(),
    parentId: Type.Optional(Type.Integer()),
    parentKey: Type.Optional(Type.String({ format: 'base64url' })),
  })
], { additionalProperties: false });

export const CategoriesUpdate = Type.Partial(CategoriesInsert);

/******************************************************************************
 * Categories images schemas
 *****************************************************************************/

export const CategoriesImagesInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    categoryId: Type.Integer(),
    url: Type.String({ maxLength: 255 }),
    mimetype: Type.Union([Type.String({ maxLength: 255 }), Type.Null()]),
  })
], { additionalProperties: false });

export const CategoriesImagesUpdate = Type.Partial(CategoriesImagesInsert);
