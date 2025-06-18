import * as op from 'drizzle-orm';
import { db } from '@/db';
import CoreAccessor from '@/utils/accessors/CoreAccessor';
import { users } from '@/models/users';
import { UsersInsert, UsersUpdate } from '@/typebox/accessors/users';

/*******************************************************************************
 * Users
 ******************************************************************************/

export class UsersAccessor extends CoreAccessor {
  constructor () {
    super(
      users,
      {
        insertSchema: UsersInsert,
        updateSchema: UsersUpdate,
      }
    );
  }
}
export const usersAccessor = new UsersAccessor();
