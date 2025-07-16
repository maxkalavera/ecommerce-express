import lodash from 'lodash';
import deepmerge from '@fastify/deepmerge';
import { OpenAPI } from '@/openapi';


const mergeDeep = deepmerge({ all: true });

export class OpenAPIBuilder {
  protected document: Partial<OpenAPI.Document> = {
    openapi: '3.0.1',
  } as OpenAPI.Document;

  protected _defaults(...args: Parameters<typeof lodash.defaults>) {
    return lodash.defaults(...args);    
  }

    protected _defaultsDeep(...args: Parameters<typeof lodash.defaultsDeep>) {
    return lodash.defaultsDeep(...args);    
  }

  protected _mergeDeep(...params: Parameters<typeof mergeDeep>) {
    return mergeDeep(...params);
  }

  protected _getcommonKeys<
    T extends Record<string, any>, 
    U extends Record<string, any>
  > (
    left: T, 
    right: U
  ): (keyof T & keyof U)[] {
  const keys1 = Object.keys(left) as Array<keyof T>;
  const keys2 = Object.keys(right) as Array<keyof U>;
  
  return keys1.filter(key => keys2.includes(key as any)) as (keyof T & keyof U)[];
}

  public createDocument(
    docs: OpenAPI.Document
  )
  {
    this.document = this._mergeDeep({
      openapi: '3.0.1',
    }, docs);

    return this;
  }

  public setInfo(info: OpenAPI.InfoObject) {
    this.document.info = info;
  }

  public addServer(server: OpenAPI.ServerObject) {
    if (this.document.servers === undefined) {
      this.document.servers = [];
    }
    this.document.servers.push(server);
  }

  public addPath(
    path: string,
    pathItem: OpenAPI.PathItemObject
  )
  {
    if (this.document.paths === undefined) {
      this.document.paths = {};
    }

    if (this.document.paths[path] !== undefined) {
      const commonKeys = this._getcommonKeys(this.document.paths[path], pathItem);
      if (commonKeys.length > 0) {
        throw new Error(`Path "${path}" with method "${commonKeys}" already exist`);
      }
    }
    this.document.paths[path] = this._mergeDeep(
      this.document.paths[path],
      pathItem
    );
  }

  public addSchema(
    schemaName: string,
    schema: OpenAPI.SchemaObject | OpenAPI.ReferenceObject
  ) {
    if (this.document.components === undefined) {
      this.document.components = {};
    }
    if (this.document.components.schemas === undefined) {
      this.document.components.schemas = {};
    }
    this.document.components.schemas[schemaName] = schema;
    return this;
  }

  public buildDocument () {
    return this.document;
  }
}