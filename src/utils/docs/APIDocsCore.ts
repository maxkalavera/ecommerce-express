import deepmerge from '@fastify/deepmerge';
import { OpenAPI } from '@/openapi';


const merge = deepmerge({ all: true });

export type DocsExtendHelpers = {
  pathsMap: Map<string, string>;
};

export class APIDocsCore {
  document: Partial<OpenAPI.Document> = {};
  pathsMap: Map<string, string> = new Map();

  constructor() {
    this.pathsMap = new Map();
    this.buildDocument();
  }

  protected _merge(...params: Parameters<typeof merge>) {
    return merge(...params);
  }

  protected _buildHelpersObject(): DocsExtendHelpers 
  {
    return { 
      pathsMap: this.pathsMap 
    };
  }

  /****************************************************************************
   * Document helpers
   ***************************************************************************/

  public mergeDocument(document: OpenAPI.Document): OpenAPI.Document 
  {
    return this._merge(document, this.document) as OpenAPI.Document;
  }

  public buildDocument() {
    const document = this.createDocument();
    return document;
  }

  public createDocument(): Partial<OpenAPI.Document> {
    return {
      openapi: '3.1.0',
      paths: {},
    };
  }

  public extendDocument (
    specs: Partial<OpenAPI.Document> | ((helpers: DocsExtendHelpers) => Partial<OpenAPI.Document>)
  ): APIDocsCore 
  {
    if (typeof specs === 'function') {
      const callbackSpecs = specs(this._buildHelpersObject());
      this.document = this._merge(this.document, callbackSpecs);
    } else {
      this.document = this._merge(this.document, specs);
    }
    return this;
  }

  /****************************************************************************
   * Paths helpers
   ***************************************************************************/

  public setPaths (
    pathsObject: 
      | OpenAPI.PathsObject 
      | ((helpers: DocsExtendHelpers) => OpenAPI.PathsObject)
  ) {
    this.document.paths = typeof pathsObject === 'function' ? pathsObject(this._buildHelpersObject()) : pathsObject;
  }

  public extendPaths (
    pathsObject: 
      | OpenAPI.PathsObject 
      | ((helpers: DocsExtendHelpers) => OpenAPI.PathsObject)
  ): APIDocsCore 
  {
    if (typeof pathsObject === 'function') {
      const callbackPaths = pathsObject(this._buildHelpersObject());
      this.document.paths = this._merge(this.document.paths, callbackPaths);
    } else {
      this.document.paths = this._merge(this.document.paths, pathsObject);
    }
    return this;
  }
}