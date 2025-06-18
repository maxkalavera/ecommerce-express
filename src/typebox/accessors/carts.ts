import { Type } from '@sinclair/typebox';


/******************************************************************************
 * Carts
 *****************************************************************************/

export const CartsInsert = Type.Object({
  userId: Type.String(),
});

export const CartsUpdate = Type.Partial(CartsInsert);

/******************************************************************************
 * Carts items
 *****************************************************************************/

export const CartsItemsInsert = Type.Object({
  cartId: Type.String(),
  productId: Type.String(),
});

export const CartsItemsUpdate = Type.Partial(CartsItemsInsert);