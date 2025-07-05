import { Type } from '@sinclair/typebox';
import { BaseSchema } from '@/typebox/accessors/commons';


/******************************************************************************
 * Users
 *****************************************************************************/

export const UsersInsert = Type.Composite([
  BaseSchema,
  Type.Object({
    username: Type.String({ maxLength: 255 }),
    email: Type.String({ maxLength: 255 }),
    password: Type.String({ maxLength: 255 }),
  })
]);

export const UsersUpdate = Type.Partial(UsersInsert);