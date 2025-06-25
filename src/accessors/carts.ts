import * as op from 'drizzle-orm';
import CoreAccessor from '@/utils/accessors/CoreAccessor';
import { carts, cartsItems } from '@/schema';
import {
  CartsInsert, CartsUpdate,
  CartsItemsInsert, CartsItemsUpdate,
} from '@/typebox/accessors/carts';


/******************************************************************************
 * Carts
 *****************************************************************************/

export class CartsAccessor extends CoreAccessor {
  constructor() {
    super(
      carts,
      {
        insertSchema: CartsInsert,
        updateSchema: CartsUpdate,
      }
    );
  }
}
export const cartsAccessor = new CartsAccessor();

/******************************************************************************
 * Carts items
 *****************************************************************************/

export class CartsItemsAccessor extends CoreAccessor {
  constructor() {
    super(
      cartsItems,
      {
        insertSchema: CartsItemsInsert,
        updateSchema: CartsItemsUpdate,
      }
    );
  }
}
export const cartsItemsAccessor = new CartsItemsAccessor();