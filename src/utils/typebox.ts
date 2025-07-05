import { Type, TSchema } from '@sinclair/typebox';


export const Nullable = <T extends TSchema>(T: T) => {
  return Type.Union([T, Type.Null()])
}
