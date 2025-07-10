
import { OpenAPI } from '@/openapi';
import { OpenAPIBuilder } from '@/utils/docs/OpenAPIBuilder';


type AddOperationOptions = {
  mode: 'soft' | 'hard',
  pathItem: OpenAPI.PathItemObject;
  parameters?: OpenAPI.ParameterObject[];
  requestBody?: OpenAPI.RequestBodyObject;
  requestBodySchema?: OpenAPI.SchemaObject | OpenAPI.ReferenceObject;
  responses?: OpenAPI.ResponsesObject;
  successResponseSchema?: OpenAPI.SchemaObject | OpenAPI.ReferenceObject;
  errorResponseSchema?: OpenAPI.SchemaObject | OpenAPI.ReferenceObject;
};


export class OpenAPICRUDBuilder extends OpenAPIBuilder {
  protected resourceName: string;
  protected defaultIdentifierParameter: OpenAPI.ParameterObject = {
    name: 'key',
    in: 'path',
    required: true,
    schema: {
      type: 'string',
      format: 'base64url'
    }
  };

  constructor(resourceName: string) {
    super();
    this.resourceName = resourceName;
  }

  public addOperation(
    path: string, 
    method: `${OpenAPI.HttpMethods}`, 
    _options: Partial<AddOperationOptions> = {}
  ) 
  {
    const options: AddOperationOptions = this._defaults({
      path: path,
      ..._options,
    }, {
      mode: 'soft',
      pathItem: {},
      parameters: undefined,
      requestBody: undefined,
      requestBodySchema: undefined,
      responses: undefined,
      successResponseSchema: undefined,
      errorResponseSchema: undefined
    }as AddOperationOptions);

    if (options.mode === 'soft') {
      this.addPath(path, this._mergeDeep(
        {
          [method]: {
            tags: [`${this.resourceName}`],
          }
        } as OpenAPI.PathItemObject,
        options.pathItem,
        {
          [method]: {
            parameters: options.parameters,
            requestBody: options.requestBody,
            responses: options.responses,
          }
        } as OpenAPI.PathItemObject,
        {
          [method]: {
            requestBody: options.requestBodySchema && {
              content: {
                'application/json': {
                  schema: options.requestBodySchema,
                }
              }
            },
            responses: {
              '200': {
                description: 'OK response',
                content: options.successResponseSchema && {
                  'application/json': {
                    schema: options.successResponseSchema,
                  }
                }
              },
              'default': {
                description: 'Default error response',
                content: options.errorResponseSchema && {
                  'application/json': {
                    schema: options.errorResponseSchema,
                  }
                }
              },
            }
          }
        } as OpenAPI.PathItemObject,
      )); 
    } else if (options.mode === 'hard') {
      this.addPath(path, options.pathItem);
    }

    return this;
  }

  public addCreateOperation(
    _options: Partial<
      AddOperationOptions & { 
        path: string;
        method: 'post' 
      }
    > = {}
  ) {
    const options = this._defaults({
      path: `/${this.resourceName}`,
      method: 'post',
    }, _options);
    const { path, method, ...operationOptions } = options;
    return this.addOperation(path, method, operationOptions);
  }

  public addUpdateOperation(
    _options: Partial<
      AddOperationOptions & { 
        path: string;
        method: 'put' 
      }
    > = {}
  ) {
    const options = this._defaults({
      path: `/${this.resourceName}/{${this.defaultIdentifierParameter.name}}`,
      method: 'put',
      parameters: [this.defaultIdentifierParameter],
    }, _options);
    const { path, method, ...operationOptions } = options;
    return this.addOperation(path, method, operationOptions);
  }

  public addDeleteOperation(
    _options: Partial<
      AddOperationOptions & { 
        path: string;
        method: 'delete' 
      }
    > = {}
  ) {
    const options = this._defaults({
      path: `/${this.resourceName}/{${this.defaultIdentifierParameter.name}}`,
      method: 'delete',
      parameters: [this.defaultIdentifierParameter],
    }, _options);
    const { path, method, ...operationOptions } = options;
    return this.addOperation(path, method, operationOptions);
  }

  public addGetOperation(
    _options: Partial<
      AddOperationOptions & { 
        path: string;
        method: 'get' 
      }
    > = {}
  ) {
    const options = this._defaults({
      path: `/${this.resourceName}/{${this.defaultIdentifierParameter.name}}`,
      method: 'get',
      parameters: [this.defaultIdentifierParameter],
    }, _options);
    const { path, method, ...operationOptions } = options;
    return this.addOperation(path, method, operationOptions);
  }

  public addListOperation(
    _options: Partial<
      AddOperationOptions & { 
        path: string;
        method: 'get' 
      }
    > = {}
  ) {
    const options = this._defaults({
      path: `/${this.resourceName}`,
      method: 'get',
    }, _options);
    const { path, method, ...operationOptions } = options;
    return this.addOperation(path, method, operationOptions);
  }

  public addCRUDResource() {
    this.addCreateOperation();
    this.addUpdateOperation();
    this.addDeleteOperation();
    this.addGetOperation();
    this.addListOperation();

    return this;
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