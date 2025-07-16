import { OpenAPICRUDBuilder } from '@/utils/docs/OpenAPICRUDBuilder';
import * as productsSchemas from '@/typebox/services/products';


export const productsDocs = new OpenAPICRUDBuilder('products')
  .setAllowedOperations("view")
  .setDefaultSuccessItemSchema(productsSchemas.Product)
  .addCreateOperation({
    requestBodySchema: productsSchemas.ProductInsert,
  })
  .addUpdateOperation({
    requestBodySchema: productsSchemas.ProductUpdate,
  })
  .addDeleteOperation()
  .addGetOperation()
  .addListOperation({
    parameters: [],
  })
  .buildDocument();
