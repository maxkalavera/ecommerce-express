import { Type } from '@sinclair/typebox';


export const CommonIdentifiers = Type.Object({
  key: Type.Optional(Type.String({ format: 'base64url' })),
});

export const CommonQueryParams = Type.Object({
  cursor: Type.Optional(Type.String({ format: 'base64url' })),
  limit: Type.Optional(Type.Number()),
});