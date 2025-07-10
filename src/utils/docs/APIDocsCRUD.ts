import { OpenAPI } from '@/openapi';
import { APIDocsCore } from '@/utils/docs/APIDocsCore';


export class APIDocsCRUD extends APIDocsCore {
  protected resourceName: String;

  constructor (resourceName: string) {
    super();
    this.resourceName = resourceName;
    this.extendPaths(this.getCreatePaths());
    this.extendPaths(this.getUpdatePaths());
    this.extendPaths(this.getDeletePaths());
    this.extendPaths(this.getReadPaths());
    this.extendPaths(this.getListPaths());
  }

  /****************************************************************************
   * Common geters
   ***************************************************************************/

  protected getDefaultTags (): string[]
  {
    return [`${this.resourceName}`];
  }

  protected getDefaultParameters (): OpenAPI.ParameterObject[]
  {
    return [];
  }

  protected getDefaultIdentifyParameters(): OpenAPI.ParameterObject[]
  {
    return [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string'
        },
        description: `ID of the ${this.resourceName}`
      }
    ];
  }

  protected getDefaultListParameters(): OpenAPI.ParameterObject[]
  {
    return [
      {
        name: 'page',
        in: 'query',
        required: false,
        schema: {
          type: 'integer',
          minimum: 1,
          default: 1
        },
        description: 'Page number for pagination'
      },
      {
        name: 'limit',
        in: 'query', 
        required: false,
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 10
        },
        description: 'Number of items per page'
      }
    ];
  }

  protected getDefaultRequestBody(): OpenAPI.RequestBodyObject
  {
    return {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {}
          }
        }
      }
    }
  }

  protected getDefaultResponses(): OpenAPI.ResponsesObject
  {
    return {
      '200': {
        description: "OK response",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {}
            }
          }
        }
      },
      default: {
        description: "Unexpected error",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {}
            }
          }
        }
      }
    };
  }

  /****************************************************************************
   * Create operation geters
   ***************************************************************************/

  protected getCreatePathURI(): string 
  {
    return `/${this.resourceName}`;
  }

  protected getCreateOperation(): keyof OpenAPI.PathsObject
  {
    return 'post'
  }

  protected getDefaultCreateParameters(): OpenAPI.ParameterObject[]
  {
    return this.getDefaultParameters();
  }

  protected getDefaultCreateRequestBody(): OpenAPI.RequestBodyObject
  {
    return this.getDefaultRequestBody();
  }

  protected getDefaultCreateResponses(): OpenAPI.ResponsesObject
  {
    return this.getDefaultResponses();
  }

  protected getDefaultCreatePostOperation(): OpenAPI.OperationObject
  {
    return {
      tags: [...this.getDefaultTags()],
      summary: `Create a new ${this.resourceName}`,
      description: `Create a new ${this.resourceName}`,
      parameters: this.getDefaultCreateParameters(),
      requestBody: this.getDefaultCreateRequestBody() as any,
      responses: this.getDefaultCreateResponses() as any
    };
  }

  protected getCreatePaths(): OpenAPI.PathsObject
  {
    return {
      [this.getCreatePathURI()]: {
        [this.getCreateOperation()]: this.getDefaultCreatePostOperation() as any,
      }
    };
  }

  /****************************************************************************
   * Update operation geters
   ***************************************************************************/

  protected getUpdatePaths(): OpenAPI.PathsObject
  {
    return {
      [`/${this.resourceName}/{id}`]: {
        put: {
          tags: [...this.getDefaultTags()],
          summary: `Update a ${this.resourceName}`,
          description: `Update an existing ${this.resourceName} by ID`,
          parameters: this.getDefaultIdentifyParameters(),
          requestBody: this.getDefaultRequestBody() as any,
          responses: this.getDefaultResponses() as any
        }
      }
    }
  }

  /****************************************************************************
   * Delete operation geters
   ***************************************************************************/

  protected getDeletePaths(): OpenAPI.PathsObject
  {
    return {
      [`/${this.resourceName}/{id}`]: {
        delete: {
          tags: [...this.getDefaultTags()],
          summary: `Delete a ${this.resourceName}`,
          description: `Delete an existing ${this.resourceName} by ID`,
          parameters: this.getDefaultIdentifyParameters(),
          responses: this.getDefaultResponses() as any
        }
      }
    }
  }

  /****************************************************************************
   * Read operation geters
   ***************************************************************************/

  protected getReadPaths(): OpenAPI.PathsObject
  {
    return {
      [`/${this.resourceName}/{id}`]: {
        get: {
          tags: [...this.getDefaultTags()],
          summary: `Get a ${this.resourceName}`,
          description: `Retrieve a ${this.resourceName} by ID`,
          parameters: this.getDefaultIdentifyParameters(),
          responses: this.getDefaultResponses() as any
        }
      }
    }
  }

  /****************************************************************************
   * List operation geters
   ***************************************************************************/

  protected getListPaths(): OpenAPI.PathsObject
  {
    return {
      [`/${this.resourceName}`]: {
        get: {
          tags: [...this.getDefaultTags()],
          summary: `List ${this.resourceName}s`,
          description: `Retrieve a list of ${this.resourceName}s`,
          parameters: this.getDefaultListParameters(),
          responses: this.getDefaultResponses() as any
        }
      }
    }
  }

}