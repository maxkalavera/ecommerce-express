import base64url from 'base64url';
import { cartsAccessor, cartsItemsAccessor } from "@/accessors/carts";
import cartsJson from '@assets/fixtures/carts.json' with { type: 'json' };
import cartsItemsJson from '@assets/fixtures/carts-items.json' with { type: 'json' };

export async function seedCarts(tx: any) {
  for (const row of (cartsJson as Record<string, any>[])) {
    const userKey = base64url.encode(row.userKey);
    await cartsAccessor.create({
      ...row,
      key: base64url.encode(row.key),
      userKey: userKey,
    });

  }

  for (const row of (cartsItemsJson as Record<string, any>[])) {
    await cartsItemsAccessor.create({
      ...row,
      key: base64url.encode(row.key)
    });
  }
}