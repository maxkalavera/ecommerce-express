import { Type } from '@sinclair/typebox';
import { Nullable } from '@/utils/typebox';
import { CommonIdentifiers, CommonQueryParams } from '@/typebox/services/commons';


export const CartItem = Type.Object({

});

export const CartItemInsert = Type.Object({

});

export const CartItemUpdate = Type.Object({

});

export const CartItemIdentifiers = Type.Composite([
  CommonIdentifiers,
  Type.Object({})
]);

export const CartItemQueryParams = Type.Composite([
  CommonQueryParams,
  Type.Object({})
]);