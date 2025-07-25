import { Type } from '@sinclair/typebox';
import { Nullable, Base64URL, Decimal } from '@/utils/typebox';
import { BaseSchema } from '@/typebox/accessors/commons';

/******************************************************************************
 * Products
 *****************************************************************************/

export const ProductsInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    name: Type.String({ maxLength: 255 }),
    description: Type.String(),
    price: Type.String({ format: 'decimal' }),
    color: Type.String({ maxLength: 255 }),
    colorHex: Type.String({ maxLength: 7 }),
    // Label
    isLabeled: Type.Optional(Type.Boolean()),
    labelContent: Type.Optional(Type.String({ maxLength: 255 })),
    labelColor: Type.Optional(Type.String({ maxLength: 7 })),
    categoryId: Type.Optional(Type.Integer()),
    categoryKey: Type.String({ format: 'base64url' }),
  })
], { additionalProperties: false });

export const ProductsUpdate = Type.Partial(ProductsInsert, { additionalProperties: false });

/******************************************************************************
 * Products items
 *****************************************************************************/

export const ProductsItemsInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    isFavorite: Type.Boolean(),
    isOnCart: Type.Boolean(),
    // specific attributes
    quantity: Type.Integer(),
    size: Type.String({ maxLength: 255 }),
    productId: Type.Integer(),
    productKey: Type.Optional(Type.String({ format: 'base64url' })),
  })
], { additionalProperties: false });

export const ProductsItemsUpdate = Type.Partial(ProductsItemsInsert, { additionalProperties: false });

export const ProductItemsQueryParams = Type.Partial(Type.Object({
  search: Type.String(),
  newArrivals: Type.Boolean(),
  saleItems: Type.Boolean(),
  category: Base64URL(),
  sort: Type.String({ enum: ['relevance', 'trending', 'latest-arrival', 'price-low-high', 'price-high-low'] }),
  color: Type.String(),
  size: Type.String(),
  fromPrice: Decimal(),
  toPrice: Decimal(),
}));

/******************************************************************************
 * Products items images
 *****************************************************************************/

export const ProductsImagesInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    productId: Type.Integer(),
    url: Type.String({ maxLength: 255 }),
    mimetype: Type.Union([Type.String({ maxLength: 255 }), Type.Null()]),
    isCover: Type.Optional(Type.Boolean()),
  })
], { additionalProperties: false });

export const ProductsImagesUpdate = Type.Partial(ProductsImagesInsert, { additionalProperties: false });

export const ProductsImagesQueryParams = Type.Partial(Type.Object({
  productId: Type.Number(),
  productsIds: Type.Array(Type.Union([Type.Number(), Type.String({ pattern: '^[0-9]+$' })])),
}));