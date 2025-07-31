import { Type } from '@sinclair/typebox';
import { Nullable, Base64URL } from '@/utils/typebox';
import { BaseSchema } from '@/typebox/accessors/commons';


/******************************************************************************
 * Carts
 *****************************************************************************/

export const CartsInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    userId: Type.Optional(Type.Number()),
    userKey: Type.Optional(Base64URL()),
  })
], { additionalProperties: false });

export const CartsUpdate = Type.Partial(CartsInsert);

/******************************************************************************
 * Carts items
 *****************************************************************************/

export const CartsItemsInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    cartId:Type.Optional(Type.Number()),
    cartKey: Base64URL(),
    productItemId: Type.Optional(Type.Number()),
    productItemKey: Base64URL(),
  })
], { additionalProperties: false });

export const CartsItemsUpdate = Type.Partial(CartsItemsInsert);

export const CartsQueryParamsSchema = Type.Object({
  cartKey: Base64URL(),
});