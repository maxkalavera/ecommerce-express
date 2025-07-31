import * as op from 'drizzle-orm';
import { APIError } from '@/utils/errors';
import CoreAccessor, { BuildQueryOptions } from '@/utils/accessors/CoreAccessor';
import { carts, cartsItems } from '@/schema';
import {
  CartsInsert, CartsUpdate,
  CartsItemsInsert, CartsItemsUpdate, CartsQueryParamsSchema,
} from '@/typebox/accessors/carts';
import { usersAccessor } from "@/accessors/users";
import { productsItemsAccessor } from "@/accessors/products";



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

  async create(
    data: Record<string, any>
  ) {
    let { cartId, cartKey, productItemId, productItemKey } = data;
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
    if (productItemKey && !productItemId) {
      const productItemPayload = await productsItemsAccessor.read({ key: productItemKey });
      if (!productItemPayload.isSuccess()) {
        throw this.buildError({ sensitive: { message: `Product item ${productItemKey} could not get retrieved` } }, productItemPayload.getError());
      }
      const productItem = productItemPayload.getPayload().data;
      productItemId = productItem.id;
    }

    try {
      return await super.create({
        ...data,
        cartId,
        cartKey,
        productItemId,
        productItemKey,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("#I4dOnz8ONyBG")) {
        throw this.buildError({
          public: {
            message: `Received product is already in selected cart`,
            code: 400,
          }
        }, error);
      }
      throw error;
    }
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

}
export const cartsItemsAccessor = new CartsItemsAccessor();