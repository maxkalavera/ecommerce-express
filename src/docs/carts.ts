import { OpenAPICRUDBuilder } from '@/utils/docs/OpenAPICRUDBuilder';
import * as cartItemSchemas from '@/typebox/services/carts';


export const cartsItemsDocs = new OpenAPICRUDBuilder('carts/items')
  .setAllowedOperations(['create', 'update', 'delete', 'list'])
  .setDefaultSuccessItemSchema(cartItemSchemas.CartItem)
  .setDefaultTags(["Carts"])
  .addCreateOperation({
    requestBodySchema: cartItemSchemas.CartItemInsert,
  })
  .addUpdateOperation({
    requestBodySchema: cartItemSchemas.CartItemUpdate,
  })
  .addDeleteOperation({
  })
  .addGetOperation({
  })
  .addListOperation({
    parameters: [],
  })
  .addOperation(
    '/carts/items/count', 
    'get', 
    {
      tags: ['Carts'],
      summary: 'Count items in cart',
      description: 'Count items in cart',
    },
    {
      successResponseSchema: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
          },
        },
      },
    },
  )
  .buildDocument();
