import { OpenAPI } from '@/openapi';
import { DocsComposer } from '@/utils/controllers/DocsComposer';


export class DocsCRUDComposer extends DocsComposer {
  protected resourceName: String;

  constructor (resourceName: string) {
    super();
    this.resourceName = resourceName;
  }

  protected _buildGenericResponse () {

  }

  protected _createSchema () {
    return {
      paths: {
        [`/${this.resourceName}`]: {
          post: {
            summary: `Create a new ${this.resourceName}`,
            description: `Create a new ${this.resourceName}`,
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  type: 'object',
                  properties: {}
                }
              }
            },
            responses: {
               '200': {
                  description: "OK response",
                  content: {
                     'application/json': {
                        type: 'object',
                        properties: {}
                     }
                  }
               },
               default: {
                  description: "Unexpected error",
                  content: {
                     'application/json': {
                        type: 'object',
                        properties: {}
                     }
                  }
               }
            }
          }
        }
      }
    };
  }

}