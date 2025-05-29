import { OpenAPIV3_1 } from 'openapi-types';
import swaggerJSDoc from 'swagger-jsdoc';
import { TSchema } from '@sinclair/typebox';

const options: swaggerJSDoc.Options = {
  definition: {
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
  },
  apis: [
    './src/controllers/**/*.ts',
    './src/routes.ts',
  ],
}

export const specs = swaggerJSDoc(options) as OpenAPIV3_1.Document;

specs.components = {
  schemas: {
    ListQueryParamaters: {
      type: 'object',
      properties: {
        cursor: {
          type: 'string',
          format: 'uuid',
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
        },
      },
    },
  },  
};

/******************************************************************************
 * Utils
 *****************************************************************************/

export function addSchema(schema: TSchema, name: string) {
  if (!specs.components) {
    specs.components = { schemas: {} };
  }

  if (!specs.components.schemas) {
    specs.components.schemas = {};
  }

  if (specs.components.schemas[name]) {
    throw new Error(`Schema ${name} already exists`);
  }

  specs.components.schemas[name] = schema;

  return schema;
}
