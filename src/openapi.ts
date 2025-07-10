import deepmerge from '@fastify/deepmerge';
import { OpenAPIV3_1 } from 'openapi-types';
export { OpenAPIV3_1 as OpenAPI } from 'openapi-types';
import { categoriesDocs } from '@/docs/categories';


const merge = deepmerge({ all: true });

export let specs: OpenAPIV3_1.Document = {
  openapi: '3.0.1',
  info: {
    title: '',
    version: '1.0.0',
    description: 'API documentation',
  },
  servers: [
    {
      url: "http://localhost:3001/api/"
    }
  ],
  paths: {},
};


specs = merge(specs, categoriesDocs) as OpenAPIV3_1.Document;
console.log("SPECS")
console.log(JSON.stringify(specs, null, 2))

export default specs;

//specs = categoriesDocs.mergeDocument(specs);