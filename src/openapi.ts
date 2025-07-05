import { OpenAPIV3_1 } from 'openapi-types';

export type Document = OpenAPIV3_1.Document;

export const specs: Document = {
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
  paths: {}
};
