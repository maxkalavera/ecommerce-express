
import { Type, TSchema } from '@sinclair/typebox';
import { OpenAPI } from '@/openapi';
import { OpenAPIBuilder } from '@/utils/docs/OpenAPIBuilder';
import { PayloadSingle, PayloadMany } from '@/typebox/commons';


type CRUDKeyword = "create" | "update" | "delete" | "read" | "list" | "view" | "mutate" | "all";

type AddOperationOptions = {
  mode: 'soft' | 'hard',
  parameters?: OpenAPI.ParameterObject[];
  requestBody?: OpenAPI.RequestBodyObject;
  requestBodySchema?: OpenAPI.SchemaObject | OpenAPI.ReferenceObject;
  responses?: OpenAPI.ResponsesObject;
  successResponseSchema?: OpenAPI.SchemaObject | OpenAPI.ReferenceObject;
  errorResponseSchema?: OpenAPI.SchemaObject | OpenAPI.ReferenceObject;
};


export class OpenAPICRUDBuilder extends OpenAPIBuilder {
  protected resourceName: string;
  protected allowedOperations: (CRUDKeyword)[] = ["all"];
  protected defaultIdentifierParameter: OpenAPI.ParameterObject = {
    name: 'key',
    in: 'path',
    required: true,
    schema: {
      type: 'string',
      format: 'base64url'
    }
  };
  protected basePaginationParameters: OpenAPI.ParameterObject[] = [
    { 
      name: "cursor", 
      in: "query" 
    },
    { 
      name: "limit", 
      in: "query" 
    },
  ];
  protected defaultSuccessItemSchema: TSchema = Type.Object({});

  constructor(
    resourceName: string, 
  ) {
    super();
    this.resourceName = resourceName;
  }

  setDefaultSuccessItemSchema(schema: TSchema) 
  {
    this.defaultSuccessItemSchema = schema;
    return this;
  }

  public setAllowedOperations(
    operations: (CRUDKeyword)[] | CRUDKeyword
  ) {
    this.allowedOperations = Array.isArray(operations) ? operations : [operations];
    return this;
  }

  public addOperation(
    path: string, 
    method: `${OpenAPI.HttpMethods}`,
    operation: OpenAPI.OperationObject,
    _options: Partial<AddOperationOptions> = {}
  ) 
  {
    const options: AddOperationOptions = this._defaults(_options, {
      mode: 'soft',
      parameters: undefined,
      requestBody: undefined,
      requestBodySchema: undefined,
      responses: undefined,
      successResponseSchema: undefined,
      errorResponseSchema: undefined
    }as AddOperationOptions);

    if (options.mode === 'soft') {
      const pathItem = this._mergeDeep(
        {
          [method]: {}
        } as OpenAPI.PathItemObject,
        {
          [method]: operation
        } as OpenAPI.PathItemObject,
        {
          [method]: {
            parameters: options.parameters || {},
            requestBody: options.requestBody || {},
            responses: options.responses || {},
          }
        } as OpenAPI.PathItemObject,
        {
          [method]: {
            requestBody: options.requestBodySchema !== undefined
              ? {
                content: {
                  'application/json': {
                    schema: options.requestBodySchema,
                  }
                }
              }
              : {},
            responses: {
              '200': {
                description: 'OK response',
                content: options.successResponseSchema !== undefined
                  ? {
                    'application/json': {
                      schema: options.successResponseSchema,
                    }
                  }
                  : {}
              },
              'default': {
                description: 'Default error response',
                content: options.errorResponseSchema !== undefined 
                  ? {
                    'application/json': {
                      schema: options.errorResponseSchema,
                    }
                  }
                  : {}
              },
            }
          }
        } as OpenAPI.PathItemObject,
      );
      this.addPath(path, pathItem); 
    } else if (options.mode === 'hard') {
      this.addPath(path, {
        [method]: operation
      } as OpenAPI.PathItemObject);
    }

    return this;
  }

  public addCreateOperation(
    _options: Partial<
      AddOperationOptions & {
        path: string;
        method: 'post';
        operation: OpenAPI.OperationObject;
        successItemSchema: TSchema;
      }
    > = {}
  ) {
    if (!multipleContains(this.allowedOperations, ["all", "create", "mutate"])) {
      return this;
    }

    const options = this._defaults({
      path: `/${this.resourceName}`,
      method: 'post',
      operation: {},
      successItemSchema: this.defaultSuccessItemSchema,
    }, _options);
    const { 
      path, method, operation, 
      successItemSchema, successResponseSchema, 
      ...operationOptions 
    } = options;
    return this.addOperation(
      path, 
      method, 
      {
        tags: [`${this.resourceName}`],
        summary: `Create a ${this.resourceName}`,
        description: `Create a new ${this.resourceName}`,
        ...operation
      }, 
      {
        ...operationOptions,
        successResponseSchema: (
          successResponseSchema ||
          (successItemSchema && PayloadSingle(successItemSchema))
        ),
      }
    );
  }

  public addUpdateOperation(
    _options: Partial<
      AddOperationOptions & { 
        path: string;
        method: 'put';
        operation: OpenAPI.OperationObject;
        successItemSchema: TSchema;
      }
    > = {}
  ) {
    if (!multipleContains(this.allowedOperations, ["all", "update", "mutate"])) {
      return this;
    }

    const options = this._defaults({
      path: `/${this.resourceName}/{${this.defaultIdentifierParameter.name}}`,
      method: 'put',
      operation: {},
      parameters: [this.defaultIdentifierParameter],
      successItemSchema: this.defaultSuccessItemSchema,
    }, _options);
    const { 
      path, method, operation, 
      successItemSchema, successResponseSchema, 
      ...operationOptions 
    } = options;
    return this.addOperation(
      path, 
      method, 
      {
        tags: [`${this.resourceName}`],
        summary: `Update a ${this.resourceName}`,
        description: `Update an existing ${this.resourceName} by ${this.defaultIdentifierParameter.name}`,
        ...operation
      }, 
      {
        ...operationOptions,
        successResponseSchema: (
          successResponseSchema ||
          (successItemSchema && PayloadSingle(successItemSchema))
        ),
      }
    );
  }

  public addDeleteOperation(
    _options: Partial<
      AddOperationOptions & { 
        path: string;
        method: 'delete';
        operation: OpenAPI.OperationObject;
        successItemSchema: TSchema;
      }
    > = {}
  ) {
    if (!multipleContains(this.allowedOperations, ["all", "delete", "mutate"])) {
      return this;
    }

    const options = this._defaults({
      path: `/${this.resourceName}/{${this.defaultIdentifierParameter.name}}`,
      method: 'delete',
      operation: {},
      parameters: [this.defaultIdentifierParameter],
      successItemSchema: this.defaultSuccessItemSchema,
    }, _options);
    const { 
      path, method, operation, 
      successItemSchema, successResponseSchema, 
      ...operationOptions 
    } = options;
    return this.addOperation(
      path, 
      method, 
      {
        tags: [`${this.resourceName}`],
        summary: `Delete a ${this.resourceName}`,
        description: `Delete an existing ${this.resourceName} by ${this.defaultIdentifierParameter.name}`,
        ...operation
      }, 
      {
        ...operationOptions,
        successResponseSchema: (
          successResponseSchema ||
          (successItemSchema && PayloadSingle(successItemSchema))
        ),
      }
    );
  }

  public addGetOperation(
    _options: Partial<
      AddOperationOptions & { 
        path: string;
        method: 'get';
        operation: OpenAPI.OperationObject;
        successItemSchema: TSchema;
      }
    > = {}
  ) {
    if (!multipleContains(this.allowedOperations, ["all", "read", "view"])) {
      return this;
    }

    const options = this._defaults({
      path: `/${this.resourceName}/{${this.defaultIdentifierParameter.name}}`,
      method: 'get',
      operation: {},
      parameters: [this.defaultIdentifierParameter],
      successItemSchema: this.defaultSuccessItemSchema,
    }, _options);
    const { 
      path, method, operation, 
      successItemSchema, successResponseSchema, 
      ...operationOptions 
    } = options;
    return this.addOperation(
      path, 
      method, 
      {
        tags: [`${this.resourceName}`],
        summary: `Get a ${this.resourceName}`,
        description: `Get an existing ${this.resourceName} by ${this.defaultIdentifierParameter.name}`,
        ...operation
      }, 
      {
        ...operationOptions,
        successResponseSchema: (
          successResponseSchema ||
          (successItemSchema && PayloadSingle(successItemSchema))
        ),
      }
    );
  }

  public addListOperation(
    _options: Partial<
      AddOperationOptions & { 
        path: string;
        method: 'get';
        operation: OpenAPI.OperationObject;
        successItemSchema: TSchema;
      }
    > = {}
  ) {
    if (!multipleContains(this.allowedOperations, ["all", "list", "view"])) {
      return this;
    }

    const options = this._defaults({
      path: `/${this.resourceName}`,
      method: 'get',
      operation: {},
      successItemSchema: this.defaultSuccessItemSchema,
    }, _options);
    const { 
      path, method, operation, 
      parameters, successItemSchema, successResponseSchema, 
      ...operationOptions 
    } = options;
    return this.addOperation(
      path, 
      method, 
      {
        tags: [`${this.resourceName}`],
        summary: `List ${this.resourceName}`,
        description: `List all ${this.resourceName}`,
        ...operation
      },
      {
        ...operationOptions,
        parameters: [
          ...this.basePaginationParameters,
          ...parameters,
        ],
        successResponseSchema: (
          successResponseSchema ||
          (successItemSchema && PayloadMany(successItemSchema))
        ),
      }
    );
  }

};

/******************************************************************************
 * Utils
 *****************************************************************************/

function coalesce<Args extends any[]>(
  ...args: Args
) {
  return args.find(arg => arg !== undefined);
}

function multipleContains(
  arr: string[], 
  values: string[]
) {
  // Check if array contains any of the given values
  return values.some(value => arr.includes(value));

}