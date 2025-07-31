import { Type } from '@sinclair/typebox';
import { Nullable, Base64URL } from '@/utils/typebox';
import { CommonIdentifiers, CommonQueryParams } from '@/typebox/services/commons';


export const CartItem = Type.Object({
  //cartKey: Base64URL(),
  productKey: Base64URL(),
});

export const CartItemInsert = Type.Object({
  //cartKey: Base64URL(),
  productKey: Base64URL(),
});

export const CartItemUpdate = Type.Object({
  //cartKey: Base64URL(),
  productKey: Base64URL(),
});

export const CartItemIdentifiers = Type.Composite([
  CommonIdentifiers,
  Type.Object({})
]);

export const CartItemQueryParams = Type.Composite([
  CommonQueryParams,
  Type.Object({})
]);