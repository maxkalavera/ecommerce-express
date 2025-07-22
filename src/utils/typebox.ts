import { Type, TSchema, StringOptions } from '@sinclair/typebox';


export const Nullable = <T extends TSchema>(T: T) => {
  return Type.Union([T, Type.Null()])
};

export const Base64URL = (options: StringOptions = {}) => {
  return Type.String({
    ...options,
    format: 'base64url',
  })
};

export const Decimal = (options: StringOptions = {}) => {
  return Type.String({
    ...options,
    format: 'decimal',
  })
};