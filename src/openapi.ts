import deepmerge from '@fastify/deepmerge';
import { OpenAPIV3_1 } from 'openapi-types';
import { categoriesDocs } from '@/docs/categories';
import { cartsItemsDocs } from '@/docs/carts';
import { productsDocs, favoritesProductsDocs } from '@/docs/products';


export { OpenAPIV3_1 as OpenAPI } from 'openapi-types';


const merge = deepmerge({ all: true });

export let specs: OpenAPIV3_1.Document = {
  openapi: '3.0.1',
  info: {
    title: '',
    version: '1.0.0',
    description: 'API documentation',
    license: {
      name: 'MIT',
      url: 'https://github.com/maxkalavera/ecommerce-express/blob/main/LICENSE'
    }
  },
  servers: [
    {
      url: "http://localhost:3001/api/"
    }
  ],
  paths: {},
};


specs = merge(specs, categoriesDocs) as OpenAPIV3_1.Document;
specs = merge(specs, cartsItemsDocs) as OpenAPIV3_1.Document;
specs = merge(specs, productsDocs) as OpenAPIV3_1.Document;
specs = merge(specs, favoritesProductsDocs) as OpenAPIV3_1.Document;



export default specs;
