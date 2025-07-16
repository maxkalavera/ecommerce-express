import { OpenAPICRUDBuilder } from '@/utils/docs/OpenAPICRUDBuilder';
import * as cartItemSchemas from '@/typebox/services/carts';


export const cartsItemsDocs = new OpenAPICRUDBuilder('carts/items')
  .setDefaultSuccessItemSchema(cartItemSchemas.CartItem)
  .addCreateOperation({
    requestBodySchema: cartItemSchemas.CartItemInsert,
  })
  .addUpdateOperation({
    requestBodySchema: cartItemSchemas.CartItemUpdate,
  })
  .addDeleteOperation()
  .addGetOperation()
  .addListOperation({
    parameters: [],
  })
  .buildDocument();
