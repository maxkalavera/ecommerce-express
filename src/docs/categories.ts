import { OpenAPICRUDBuilder } from '@/utils/docs/OpenAPICRUDBuilder';
import * as categoriesSchemas from '@/typebox/services/categories';


export const categoriesDocs = new OpenAPICRUDBuilder('categories')
  .setAllowedOperations("all")
  .setDefaultSuccessItemSchema(categoriesSchemas.Category)
  .addCreateOperation({
    requestBodySchema: categoriesSchemas.CategoryInsert,
  })
  .addUpdateOperation({
    requestBodySchema: categoriesSchemas.CategoryUpdate,
  })
  .addDeleteOperation()
  .addGetOperation()
  .addListOperation({
    parameters: [
      { name: "childrenOf", in: "query" },
    ],
  })
  .buildDocument();
