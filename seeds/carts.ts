import { cartsAccessor, cartsItemsAccessor } from "@/accessors/carts";
import cartsJson from '@assets/fixtures/carts.json' with { type: 'json' };
import cartsItemsJson from '@assets/fixtures/cartsItems.json' with { type: 'json' };

export async function seedCarts(tx: any) {
  for (const row of cartsJson) {
    await cartsAccessor.create(row);
  }

  for (const row of cartsItemsJson) {
    await cartsItemsAccessor.create(row);
  }
}