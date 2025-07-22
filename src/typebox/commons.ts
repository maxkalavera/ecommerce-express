import { Type, TSchema } from '@sinclair/typebox';
import { Nullable } from '@/utils/typebox';


export const PayloadSingleSchema = <Instance extends TSchema>(Instance: Instance) => 
  Type.Object({
    data: Instance,
  });


export const PayloadManySchema = <Instance extends TSchema>(Instance: Instance) => 
  Type.Object({
    items: Type.Array(Instance),
    cursor: Nullable(Type.String()),
    hasMore: Type.Boolean(),
  });