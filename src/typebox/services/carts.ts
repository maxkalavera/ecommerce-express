import { Type } from '@sinclair/typebox';
import settings from '@/settings';
import { Nullable, Base64URL, Decimal } from '@/utils/typebox';
import { CommonIdentifiers, CommonQueryParams } from '@/typebox/services/commons';


export const CartItem = Type.Object({
  key: Base64URL(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  productKey: Base64URL(),
  quantity: Type.Number({ minimum: 0 }),
  unitPrice: Decimal(),
  product: Nullable(Type.Object({
    key: Base64URL(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    name: Type.String({ minLength: 0, maxLength: 255 }),
    description: Type.String(),
    price: Decimal(),
    color: Type.Object({
      name: Type.Optional(Type.String({ minLength: 3, maxLength: 255 })),
      hex: Type.Optional(Type.String({ pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' })),
    }),
    label: Nullable(Type.Object({
      content: Type.String({ minLength: 0, maxLength: 255 }),
      color: Type.String({ pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' }),
    })),
    isFavorite: Type.Boolean(),
    isOnCart: Type.Boolean(),
    quantity: Type.Number({ minimum: 0 }),
    size: Type.String({ minLength: 0, maxLength: 255 }),
  })),
}, { additionalProperties: false });

export const CartItemInsert = Type.Object({
  productKey: Base64URL(),
  quantity: Type.Number({ minimum: 0, maximum: settings.PRODUCT_MAX_PUBLIC_AVAILABILITY }),
});

export const CartItemUpdate = Type.Object({
  quantity: Type.Number({ minimum: 0, maximum: settings.PRODUCT_MAX_PUBLIC_AVAILABILITY }),
});

export const CartItemIdentifiers = Type.Composite([
  CommonIdentifiers,
  Type.Object({})
]);

export const CartItemQueryParams = Type.Composite([
  CommonQueryParams,
  Type.Object({})
]);