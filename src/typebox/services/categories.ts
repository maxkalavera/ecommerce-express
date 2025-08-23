import { Type } from '@sinclair/typebox';
import { Nullable, Base64URL, Decimal } from '@/utils/typebox';


export const Category = Type.Object({
  key: Base64URL(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  name: Type.String(),
  description: Type.String(),
  parentKey: Nullable(Base64URL()),
  display: Nullable(Type.Object({
    url: Type.String(),
    mimetype: Type.String(),
  })),
  breadcrumbs: Nullable(Type.Array(Type.Object({
    key: Base64URL(),
    name: Type.String(),
  }))),
}, { additionalProperties: false });

export const CategoryInsert = Type.Object({
  name: Type.String(),
  description: Type.String(),
  parentKey: Type.Optional(Base64URL()),
});

export const CategoryUpdate = Type.Partial(CategoryInsert);

export const CategoryIdentifiers = Type.Object({
  id: Type.Optional(Type.Number()),
  key: Type.Optional(Base64URL())
});

export const CategoryQueryParams = Type.Object({
  cursor: Type.Optional(Base64URL()),
  limit: Type.Optional(Type.Number()),
  childrenOf: Type.Optional(Base64URL()),
});
