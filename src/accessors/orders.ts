import * as op from 'drizzle-orm';
import { db } from '@/db';
import CoreAccessor from '@/utils/accessors/CoreAccessor';
import { orders, ordersItems } from '@/schema';
import { 
  OrdersInsert, OrdersUpdate, 
  OrdersItemsInsert, OrdersItemsUpdate,
} from '@/typebox/accessors/orders';

/******************************************************************************
 * Orders
 *****************************************************************************/

export class OrdersAccessor extends CoreAccessor {
  constructor() {
    super(
      orders,
      {
        insertSchema: OrdersInsert,
        updateSchema: OrdersUpdate,
      }
    );
  }
}

/******************************************************************************
 * Orders items
 *****************************************************************************/

export class OrdersItemsAccessor extends CoreAccessor {
  constructor() {
    super(
      ordersItems,
      {
        insertSchema: OrdersItemsInsert,
        updateSchema: OrdersItemsUpdate,
      }
    );
  }
}
