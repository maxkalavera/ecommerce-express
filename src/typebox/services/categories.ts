import { Type } from '@sinclair/typebox';
import { Nullable } from '@/utils/typebox';


export const Category = Type.Object({
  key: Type.String({ format: 'base64url' }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  name: Type.String(),
  description: Type.String(),
  parentKey: Nullable(Type.String({ format: 'base64url' })),
  display: Nullable(Type.Object({
    url: Type.String(),
    mimetype: Type.String(),
  }))
});

export const CategoryInsert = Type.Object({
  name: Type.String(),
  description: Type.String(),
  parentKey: Type.Optional(Type.String({ format: 'base64url' })),
});

export const CategoryUpdate = Type.Partial(CategoryInsert);

export const CategoryIdentifiers = Type.Object({
  id: Type.Optional(Type.Number()),
  key: Type.Optional(Type.String({ format: 'base64url' }))
});

export const CategoryQueryParams = Type.Object({
  cursor: Type.Optional(Type.String({ format: 'base64url' })),
  limit: Type.Optional(Type.Number()),
  childrenOf: Type.Optional(Type.String({ format: 'base64url' })),
});
