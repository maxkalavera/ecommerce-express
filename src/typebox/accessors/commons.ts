import { Type } from '@sinclair/typebox';

export const CursorSchema = Type.Object({
  cursor: Type.Optional(Type.String({ format: 'base64url' })),
  limit: Type.Optional(Type.Number()),
});

export const BaseTimestampsSchema = Type.Object({
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
});

export const BaseKeysSchema = Type.Object({
  id: Type.Optional(Type.Number()),
  key: Type.Optional(Type.String({ format: 'base64url' }))
});

export const BaseSchema = Type.Composite([
  BaseKeysSchema,
  BaseTimestampsSchema,
]);
