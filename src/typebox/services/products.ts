import { Type } from '@sinclair/typebox';
import { Nullable, Base64URL, Decimal } from '@/utils/typebox';
import { CommonIdentifiers, CommonQueryParams } from '@/typebox/services/commons';


export const Product = Type.Object({
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
  size: Type.String(),
  images: Type.Array(Type.Object({
    key: Base64URL(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    url: Type.String({ format: 'uri' }),
    mimetype: Type.String(),
    isCover: Type.Boolean(),
  })),
  category: Nullable(Type.Object({
    key: Base64URL(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    name: Type.String(),
    description: Type.String(),
  })),
  categoryBreadcrumbs: Nullable(Type.Array(Type.Object({
    key: Base64URL(),
    name: Type.String(),
  }))),
  inventory: Nullable(Type.Array(Type.Object({
    productKey: Base64URL(),
    quantity: Type.Integer(),
    size: Type.String(),
    color: Type.String(),
    colorHex: Type.String(),
  }))),
  maxAvailability: Type.Number(),
  isInCart: Nullable(Type.Boolean()),
}, { additionalProperties: false });


export const ProductInsert = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 255 }),
  description: Type.Optional(Type.String()),
  price: Type.Number({ multipleOf: 0.01, maximum: 99999999999999999999.99, minimum: 0 }),
  color: Type.Optional(Type.Object({
    name: Type.Optional(Type.String({ minLength: 3, maxLength: 255 })),
    hex: Type.Optional(Type.String({ pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' })),
  })),
  label: Nullable(Type.Object({
    content: Type.Optional(Type.String({ minLength: 3, maxLength: 255 })),
    color: Type.Optional(Type.String({ pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' })),
  })),
  categoryKey: Base64URL(),
});

export const ProductUpdate = Type.Partial({
  ...ProductInsert,
  label: Type.Optional(ProductInsert.label)
});

export const ProductIdentifiers = Type.Composite([
  CommonIdentifiers,
  Type.Object({})
]);

export const ProductQueryParams = Type.Partial(Type.Composite([
  CommonQueryParams,
  Type.Object({
    search: Type.String(),
    newArrivals: Type.Boolean(),
    //saleItems: Type.Boolean(),
    category: Base64URL(),
    sortBy: Type.String({ enum: ['relevance', 'trending', 'latest-arrival', 'price-low-high', 'price-high-low'] }),
    color: Type.String(),
    size: Type.String(),
    minPrice: Decimal(),
    maxPrice: Decimal(),
  })
]));