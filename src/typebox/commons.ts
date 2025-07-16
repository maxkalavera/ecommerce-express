import { Type, TSchema } from '@sinclair/typebox';


export const PayloadSingle = <Instance extends TSchema>(Instance: Instance) => 
  Type.Object({
    data: Instance,
  });


export const PayloadMany = <Instance extends TSchema>(Instance: Instance) => 
  Type.Object({
    items: Type.Array(Instance),
    cursor: Type.Optional(Type.String()),
    hasMore: Type.Boolean(),
  });