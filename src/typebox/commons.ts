import { Type } from '@sinclair/typebox';

export const ListQueryParamaters = Type.Object({
  cursor: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
});