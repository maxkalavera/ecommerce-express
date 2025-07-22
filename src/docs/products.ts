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
    parameters: [
      {
        name: 'search',
        in: 'query',
        description: 'Search query for products',
        schema: {
          type: 'string'
        },
        required: false
      },
      {
        name: 'newArrivals',
        in: 'query',
        description: 'Filter for new arrivals',
        schema: {
          type: 'boolean',
        },
        required: false
      },
      /*
      {
        name: 'saleItems',
        in: 'query',
        description: 'Filter for sale items',
        schema: {
          type: 'boolean',
        },
        required: false
      },
      */
      {
        name: 'category',
        in: 'query',
        description: 'Category ID encoded in Base64URL format',
        schema: {
          type: 'string',
          format: 'base64url'
        },
        required: false
      },
      {
        name: 'sort',
        in: 'query',
        description: 'Sorting method for products',
        schema: {
          type: 'string',
          enum: [
            'relevance',
            'trending',
            'latest-arrival',
            'price-low-high',
            'price-high-low'
          ],
        },
        required: false
      },
      {
        name: 'color',
        in: 'query',
        description: 'Filter by color',
        schema: {
          type: 'string'
        },
        required: false
      },
      {
        name: 'size',
        in: 'query',
        description: 'Filter by size',
        schema: {
          type: 'string'
        },
        required: false
      },
      {
        name: 'fromPrice',
        in: 'query',
        description: 'Minimum price filter',
        schema: {
          type: 'number',
          format: 'decimal'
        },
        required: false
      },
      {
        name: 'toPrice',
        in: 'query',
        description: 'Maximum price filter',
        schema: {
          type: 'number',
          format: 'decimal'
        },
        required: false
      }
    ]
  })
  .buildDocument();
