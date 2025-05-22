import lodash from "lodash";
import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPIV3_1 } from "openapi-types";

/******************************************************************************
 * Types
 *****************************************************************************/

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/******************************************************************************
 * OpenAPISchemaBuilder
 *****************************************************************************/

export class OpenAPISchemaBuilder  {
  private document: OpenAPIV3_1.Document;

  constructor(schema: OpenAPIV3_1.Document) {
    this.document = lodash.defaultsDeep({
      servers: [],
      paths: {},
      components: {
        schemas: {},
      },
    }, schema);

    this.addCoreSchemas();
  }

  private addCoreSchemas() {
    this.addSchema("ErrorResponse", this.getErrorResponseSchema());
    this.addSchema("ResponseSingle", this.getResponseSingleSchema());
    this.addSchema(
      "ResponseList", 
      customMerge(this.getResponseListSchema(), this.getResponseListPaginationSchema()));
  }

  /****************************************************************************
   * Methods designed to be overriden by subclasses
   ***************************************************************************/

  /**
   * Returns the schema for error responses. This method is designed to be overridden
   * by subclasses to customize the error response format.
   * 
   * @returns {OpenAPIV3_1.SchemaObject} The schema object defining the error response structure
   */
  public getErrorResponseSchema(): OpenAPIV3_1.SchemaObject {
    return {
      type: "object",
      properties: {
        message: { type: "string" }
      },
      required: ["message"],
    };
  }

  /**
   * Returns the schema for responses with single data returned. This method is designed to be overridden
   * by subclasses to customize the error response format.
   * 
   * @returns {OpenAPIV3_1.SchemaObject} The schema object defining the returned data structure
   */
  public getResponseSingleSchema(
    dataSchema: OpenAPIV3_1.SchemaObject = { type: "object" }
  ): OpenAPIV3_1.SchemaObject 
  {
    return {
      type: "object",
      properties: {
        data: dataSchema,
      },
      required: ["data"],
    };
  }

  /**
   * Returns the schema for responses with list data returned. This method is designed to be overridden
   * by subclasses to customize the error response format.
   * 
   * @returns {OpenAPIV3_1.SchemaObject} The schema object defining the returned data structure
   */
  public getResponseListSchema(
    dataSchema: OpenAPIV3_1.SchemaObject = { type: "object" }
  ): OpenAPIV3_1.SchemaObject  
  {
    return {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: dataSchema,
        },
      },
    };
  }

  public getResponseListPaginationSchema(): OpenAPIV3_1.SchemaObject {
    return {
      type: "object",
      properties: {
        nextCursor: { 
          type: "string",
          description: "An opaque token representing the position after the last item, used to fetch the next page"
        },
        hasMore: { 
          type: "boolean",
          description: "Indicates if there are more items after the current page"
        },
      },
      required: ["page", "limit", "total"],    
    }
  }

  public getRequestGlobalParameters(): OpenAPIV3_1.ParameterObject[] {
    return [];
  }

  public getIdentifierParameter(): [string, OpenAPIV3_1.ParameterObject] {
    return [
      "id", 
      {
        name: "id",
        in: "path",
        description: "ID of the resource",
        required: true,
        schema: {
          type: "string",
        },
      }
    ];
  }

  /****************************************************************************
   * General methods
   ***************************************************************************/

  public async getDocument(): Promise<OpenAPIV3_1.Document> {
    try {
      const api = await SwaggerParser.validate(this.document);
      console.info("OpenAPI Schema is valid");
      return api as OpenAPIV3_1.Document;
    } catch (error: any) {
      console.error("OpenAPI Schema is invalid");
      console.error(error.details);
      process.exit(1);
    }
  }

  public addServer(server: OpenAPIV3_1.ServerObject) {
    this.document.servers!.push(server);
    return this;
  }

  public addPath(
    pathItem: OpenAPIV3_1.PathsObject,
  ) {
    this.document.paths! = customMerge(this.document.paths!, pathItem);
    return this;
  }

  public addSchema(name: string, schema: OpenAPIV3_1.SchemaObject) {
    if (this.document.components!.schemas![name] !== undefined) {
      throw new Error(`Schema ${name} already exists`);
    }
    this.document.components!.schemas![name] = schema;
    return this;
  }

  public hasSchema(name: string) {
    return this.document.components!.schemas![name] !== undefined;
  }

  /****************************************************************************
   * Resource methods
   ***************************************************************************/

  public addCreateActionPath(
    resourceName: string,
    path: string,
    RequestBodyschema: OpenAPIV3_1.SchemaObject,
    ResponseDataInstanceSchema: OpenAPIV3_1.SchemaObject,
    extraSchema: DeepPartial<OpenAPIV3_1.PathItemObject['post']> = {},
  ) {
    this.addPath({
      [path]: {
        post: customMerge({
          tags: [lodash.upperFirst(resourceName)],
          summary: `Create a new ${resourceName}`,
          description: `Create a new ${resourceName}`,
          operationId: `create${lodash.upperFirst(resourceName)}`,
          parameters: [
            ...this.getRequestGlobalParameters(),
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: RequestBodyschema,
              },
            },
          },
          responses: {
            200: {
              description: "The created resource",
              content: {
                "application/json": {
                  schema: this.getResponseSingleSchema(ResponseDataInstanceSchema),
                },
              },
            },
          }
        }, extraSchema),
      }
    });
    return this;
  }

  public addReadActionPath(
    resourceName: string,
    path: string,
    ResponseDataInstanceSchema: OpenAPIV3_1.SchemaObject,
    extraSchema: DeepPartial<OpenAPIV3_1.PathItemObject['get']> = {},
  ) {
    const [_, identifierParameter] = this.getIdentifierParameter();
    this.addPath({
      [path]: {
        get: customMerge({
          tags: [lodash.upperFirst(resourceName)],
          summary: `Get a ${resourceName}`,
          description: `Get a ${resourceName}`,
          operationId: `get${lodash.upperFirst(resourceName)}`,
          parameters: [
            identifierParameter,
            ...this.getRequestGlobalParameters(),
          ],
          responses: {
            200: {
              description: "The resource",
              content: {
                "application/json": {
                  schema: this.getResponseSingleSchema(ResponseDataInstanceSchema),
                },
              }
            }
          }
        }, extraSchema),
      }
    });
    return this;
  }

  public addListActionPath(
    resourceName: string,
    path: string,
    ResponseDataInstanceSchema: OpenAPIV3_1.SchemaObject,
    extraSchema: DeepPartial<OpenAPIV3_1.PathItemObject['get']> = {},
  ) {
    this.addPath({
      [path]: {
        get: customMerge({
          tags: [lodash.upperFirst(resourceName)],
          summary: `List ${resourceName}`,
          description: `List ${resourceName}`,
          operationId: `list${lodash.upperFirst(resourceName)}`,
          parameters: [
            ...this.getRequestGlobalParameters(),
          ],
          responses: {
            200: {
              description: "The resources",
              content: {
                "application/json": {
                  schema: customMerge(
                    this.getResponseListSchema(ResponseDataInstanceSchema), 
                    this.getResponseListPaginationSchema()
                  ),
                }
              }
            }
          }
        }, extraSchema),
      }
    });
    return this;
  }

  public addUpdateActionPath(
    resourceName: string,
    path: string,
    RequestBodyschema: OpenAPIV3_1.SchemaObject,
    ResponseDataInstanceSchema: OpenAPIV3_1.SchemaObject,
    extraSchema: DeepPartial<OpenAPIV3_1.PathItemObject['put']> = {},
  ) {
    const [_, identifierParameter] = this.getIdentifierParameter();
    this.addPath({
      [path]: {
        put: customMerge({
          tags: [lodash.upperFirst(resourceName)],
          summary: `Update a ${resourceName}`,
          description: `Update a ${resourceName}`,
          operationId: `update${lodash.upperFirst(resourceName)}`,
          parameters: [
            identifierParameter,
            ...this.getRequestGlobalParameters(),
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: RequestBodyschema,
              },
            },
          },
          responses: {
            200: {
              description: "The updated resource",
              content: {
                "application/json": {
                  schema: this.getResponseSingleSchema(ResponseDataInstanceSchema),
                },
              },
            }
          }
        }, extraSchema),
      }
    });
    return this;
  }

  public addDeleteActionPath(
    resourceName: string,
    path: string,
    ResponseDataInstanceSchema: OpenAPIV3_1.SchemaObject,
    extraSchema: DeepPartial<OpenAPIV3_1.PathItemObject['delete']> = {},
  ) {
    const [_, identifierParameter] = this.getIdentifierParameter();
    this.addPath({
      [path]: {
        delete: customMerge({
          tags: [lodash.upperFirst(resourceName)],
          summary: `Delete a ${resourceName}`,
          description: `Delete a ${resourceName}`,
          operationId: `delete${lodash.upperFirst(resourceName)}`,
          parameters: [
            identifierParameter,
            ...this.getRequestGlobalParameters(),
          ],
          responses: {
            200: {
              description: "The deleted resource",
              content: {
                "application/json": {
                  schema: this.getResponseSingleSchema(ResponseDataInstanceSchema),
                },
              },
            }
          }
        }, extraSchema),
      }
    });
    return this;
  }

  public addCreateActionResource(
    name: string,
    insert: OpenAPIV3_1.SchemaObject,
    selectInstance: OpenAPIV3_1.SchemaObject,
    parameters: OpenAPIV3_1.ParameterObject[] = [],
  ) {
    const path = `/${name}`;
    this.addCreateActionPath(name, path, insert, selectInstance, {
      parameters: [
        ...parameters,
      ],
    });
    return this;
  }

  public addReadActionResource(
    name: string,
    selectInstance: OpenAPIV3_1.SchemaObject,
    parameters: OpenAPIV3_1.ParameterObject[] = [],
  ) {
    const [identifierName,] = this.getIdentifierParameter();
    this.addReadActionPath(name, `/${name}/{${identifierName}}`, selectInstance, {
      parameters: [
        ...parameters,
      ],
    });
    return this;
  }

  public addListActionResource(
    name: string,
    selectInstance: OpenAPIV3_1.SchemaObject,
    parameters: OpenAPIV3_1.ParameterObject[] = [],
  ) {
    this.addListActionPath(name, `/${name}`, selectInstance, {
      parameters: [
        ...parameters,
      ],
    });
    return this;
  }

  public addUpdateActionResource(
    name: string,
    update: OpenAPIV3_1.SchemaObject,
    selectInstance: OpenAPIV3_1.SchemaObject,
    parameters: OpenAPIV3_1.ParameterObject[] = [],
  ) {
    const [identifierName,] = this.getIdentifierParameter();
    this.addUpdateActionPath(name, `/${name}/{${identifierName}}`, update, selectInstance, {
      parameters: [
        ...parameters,
      ],
    });
    return this;
  }

  public addDeleteActionResource(
    name: string,
    selectInstance: OpenAPIV3_1.SchemaObject,
    parameters: OpenAPIV3_1.ParameterObject[] = [],
  ) {
    const [identifierName,] = this.getIdentifierParameter();
    this.addDeleteActionPath(name, `/${name}/{${identifierName}}`, selectInstance, {
      parameters: [
        ...parameters,
      ],
    });
    return this;
  }
}

/******************************************************************************
 * Utils
 *****************************************************************************/

function mergeCustomizer(objValue: any, srcValue: any) {
  if (lodash.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

function customMerge(object: Record<string, any>, ...sources: Record<string, any>[]) {
  return lodash.mergeWith(object, ...sources, mergeCustomizer);
}