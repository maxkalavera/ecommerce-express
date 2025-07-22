import { Type } from '@sinclair/typebox';
import { BaseSchema } from '@/typebox/accessors/commons';


/******************************************************************************
 * Carts
 *****************************************************************************/

export const CartsInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    userId: Type.String(),
  })
], { additionalProperties: false });

export const CartsUpdate = Type.Partial(CartsInsert);

/******************************************************************************
 * Carts items
 *****************************************************************************/

export const CartsItemsInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    cartId: Type.String(),
    productId: Type.String(),
  })
], { additionalProperties: false });

export const CartsItemsUpdate = Type.Partial(CartsItemsInsert);