import { Type } from '@sinclair/typebox';

/******************************************************************************
 * Users
 *****************************************************************************/

export const UsersInsert = Type.Object({
  username: Type.String({ maxLength: 255 }),
  email: Type.String({ maxLength: 255 }),
  password: Type.String({ maxLength: 255 }),
});

export const UsersUpdate = Type.Partial(UsersInsert);