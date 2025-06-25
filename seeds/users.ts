import { usersAccessor } from "@/accessors/users";
import usersJson from '@assets/fixtures/users.json' with { type: 'json' };


export async function seedUsers(tx: any) {
  for (const row of usersJson) {
    await usersAccessor.create(row);
  }
}