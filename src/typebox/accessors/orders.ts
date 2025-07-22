import { Type } from '@sinclair/typebox';
import { BaseSchema } from '@/typebox/accessors/commons';


/******************************************************************************
 * Orders
 *****************************************************************************/

export const OrdersInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    userId: Type.String({ maxLength: 255 }),
  })
], { additionalProperties: false });

export const OrdersUpdate = Type.Partial(OrdersInsert, { additionalProperties: false });

/******************************************************************************
 * Orders Items
 *****************************************************************************/

export const OrdersItemsInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    orderId: Type.String({ maxLength: 255 }),
    productId: Type.String({ maxLength: 255 }),
    quantity: Type.Number({ minimum: 0 }),
    unitPriceAtPurchase: Type.String({ format: 'decimal' }),
    priceAtPurchase: Type.String({ format: 'decimal' }),
  })
], { additionalProperties: false });

export const OrdersItemsUpdate = Type.Partial(OrdersItemsInsert, { additionalProperties: false });