import { Type } from '@sinclair/typebox';

/******************************************************************************
 * Products
 *****************************************************************************/

export const ProductsInsert = Type.Object({
  name: Type.String({ maxLength: 255 }),
  description: Type.String(),
  categoryId: Type.Integer(),
  categoryKey: Type.Optional(Type.String({ format: 'base64url' })),
});

export const ProductsUpdate = Type.Partial(ProductsInsert);

/******************************************************************************
 * Products items
 *****************************************************************************/

export const ProductsItemsInsert = Type.Object({
  isFavorite: Type.Boolean(),
  isOnCart: Type.Boolean(),
  // Label
  isLabeled: Type.Boolean(),
  labelContent: Type.String({ maxLength: 255 }),
  labelColor: Type.String({ maxLength: 7 }),
  // specific attributes
  price: Type.String({ format: 'decimal' }),
  quantity: Type.Integer(),
  color: Type.String({ maxLength: 255 }),
  size: Type.String({ maxLength: 255 }),

  productId: Type.Integer(),
  productKey: Type.Optional(Type.String({ format: 'base64url' })),
});

export const ProductsItemsUpdate = Type.Partial(ProductsItemsInsert);

/******************************************************************************
 * Products items images
 *****************************************************************************/

export const ProductsItemsImagesInsert = Type.Object({
  isCover: Type.Boolean(),
  url: Type.String({ maxLength: 255 }),
  mimetype: Type.Union([Type.String({ maxLength: 255 }), Type.Null()]),
  productId: Type.Integer(),
});

export const ProductsItemsImagesUpdate = Type.Partial(ProductsItemsImagesInsert);