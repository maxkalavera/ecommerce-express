import * as op from 'drizzle-orm';
import settings from '@/settings';
import CoreAccessor, { BuildQueryOptions } from '@/utils/accessors/CoreAccessor';
import { PayloadSingle, PayloadMany, LayersReturnType } from '@/types/layers';
import { carts, cartsItems } from '@/schema';
import {
  CartsInsert, CartsUpdate,
  CartsItemsInsert, CartsItemsUpdate, CartsQueryParamsSchema,
} from '@/typebox/accessors/carts';
import { usersAccessor } from "@/accessors/users";
import { productsItemsAccessor } from "@/accessors/products";
import { DBConnection } from '@/types/db';



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

  async create(
    data: Record<string, any>
  ) {
    let { userId, userKey } = data;
    if (userKey && !userId) {
      const userPayload = await usersAccessor.read({ key: userKey });
      if (!userPayload.isSuccess()) {
        throw this.buildError({ sensitive: { message: `User ${userKey} could not get retrieved` } }, userPayload.getError());
      }
      const user = userPayload.getPayload().data;
      userId = user.id;
    }

    return await super.create({
      ...data,
      userId: userId,
      userKey: userKey,
    });
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
        queryParamsSchema: CartsQueryParamsSchema,
      }
    );
  }

  async validateCreateData(
    data: Record<string, any>,
    conn: DBConnection = this.db,
  ): Promise<Record<string, any>>
  {

    let { cartId, cartKey, productItemId, productItemKey, quantity } = data;
    // Assign cartId ussing cartKey
    if (cartKey && !cartId) {
      const cartPayload = await cartsAccessor.read({ key: cartKey });
      if (!cartPayload.isSuccess()) {
        throw this.buildError({ sensitive: { message: `Cart ${cartKey} could not get retrieved` } }, cartPayload.getError());
      }
      const cart = cartPayload.getPayload().data;
      cartId = cart.id;
    }

    // Assign productItemId using productItemKey
    let productItem: Record<string, any> = {};
    if (productItemKey && !productItemId) {
      const productItemPayload = await productsItemsAccessor.read({ key: productItemKey });
      if (!productItemPayload.isSuccess()) {
        throw this.buildError({ sensitive: { message: `Product item ${productItemKey} could not get retrieved` } }, productItemPayload.getError());
      }
      productItem = productItemPayload.getPayload().data;
    } else if (productItemId) {
      const productItemPayload = await productsItemsAccessor.read({ id: productItemId });
      if (!productItemPayload.isSuccess()) {
        throw this.buildError({ sensitive: { message: `Product item ${productItemId} could not get retrieved` } }, productItemPayload.getError());
      }
      productItem = productItemPayload.getPayload().data;
    } else {
      throw this.buildError({ sensitive: { message: `Product item requires product item id or key to be created` } });
    }

    return {
      ...data,
      cartId,
      cartKey,
      productItemId: productItem.id,
      productItemKey,
      quantity,
      unitPrice: productItem.price,
    }
  }

  protected buildQueryBaseSelect(
    query: Record<string, any>,
    options: BuildQueryOptions,
  ) {
    return this.db
      .select(this.buildQuerySelectFields(query, options))
      .from(this.table)
      .leftJoin(carts, op.eq(cartsItems.cartId, carts.id));
  }

  protected buildQueryWhere(
    query: Record<string, any>,
    options: BuildQueryOptions,
  ) {
    const filters = super.buildKeyQueryWhere(query, options);

    if (query.cartKey) {
      filters.push(
        op.eq(this.table.cartKey, query.cartKey)
      );
    }

    return filters;
  }

  /****************************************************************************
   * Custom queries
   ***************************************************************************/

  public async countItems(
    params: {
      cartKey: string;
    }
  ): Promise<LayersReturnType<PayloadSingle<{ count: number }>>>
  {
    const count = await this.db
      .select({
        count: op.count(),
      })
      .from(this.table)
      .where(
        op.eq(this.table.cartKey, params.cartKey)
      )
      .execute();
    return this.buildReturn({  
      success: true,
      payload: {
        data: {
          count: count[0].count,
        }
      }
    });
  }

  public async createOrUpdate (
    params: Record<string, any>,
    data: Record<string, any>,
  ): Promise<LayersReturnType<PayloadSingle<any>>> 
  {
    let success = true;
    try {
      const cartItemPayload = await this.read(params);
      success = cartItemPayload.isSuccess();
      if (success) {
        data.quantity = data.quantity + cartItemPayload.getPayload().data.quantity;
      }
    } catch (error) {
      success = false;
    }

    return await this.db.transaction(async (tx) => {
      if (success) {
        return await this.update(params, data, tx);
      } else {
        return await this.create(data, tx);
      }
    });
  }

}
export const cartsItemsAccessor = new CartsItemsAccessor();