import { Type } from '@sinclair/typebox';

/******************************************************************************
 * Products
 *****************************************************************************/

export const ProductsInsert = Type.Object({
  name: Type.String({ maxLength: 255 }),
  description: Type.String(),
  price: Type.String({ format: 'decimal' }),
  color: Type.String({ maxLength: 255 }),
  colorHex: Type.String({ maxLength: 7 }),
  // Label
  isLabeled: Type.Optional(Type.Boolean()),
  labelContent: Type.Optional(Type.String({ maxLength: 255 })),
  labelColor: Type.Optional(Type.String({ maxLength: 7 })),
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
  // specific attributes
  quantity: Type.Integer(),
  size: Type.String({ maxLength: 255 }),
  productId: Type.Integer(),
  productKey: Type.Optional(Type.String({ format: 'base64url' })),
});

export const ProductsItemsUpdate = Type.Partial(ProductsItemsInsert);

/******************************************************************************
 * Products items images
 *****************************************************************************/

export const ProductsImagesInsert = Type.Object({
  productId: Type.Integer(),
  url: Type.String({ maxLength: 255 }),
  mimetype: Type.Union([Type.String({ maxLength: 255 }), Type.Null()]),
  isCover: Type.Optional(Type.Boolean()),
});

export const ProductsImagesUpdate = Type.Partial(ProductsImagesInsert);