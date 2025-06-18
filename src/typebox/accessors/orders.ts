import { Type } from '@sinclair/typebox';

/******************************************************************************
 * Orders
 *****************************************************************************/

export const OrdersInsert = Type.Object({
  userId: Type.String({ maxLength: 255 }),
});

export const OrdersUpdate = Type.Partial(OrdersInsert);

/******************************************************************************
 * Orders Items
 *****************************************************************************/

export const OrdersItemsInsert = Type.Object({
  orderId: Type.String({ maxLength: 255 }),
  productId: Type.String({ maxLength: 255 }),
  quantity: Type.Number({ minimum: 0 }),
  unitPriceAtPurchase: Type.String({ format: 'decimal' }),
  priceAtPurchase: Type.String({ format: 'decimal' }),
});

export const OrdersItemsUpdate = Type.Partial(OrdersItemsInsert);