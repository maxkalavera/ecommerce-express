import deepmerge from '@fastify/deepmerge';
import { OpenAPI } from '@/openapi';


const merge = deepmerge({ all: true });

export type DocsExtendHelpers = {
  pathsMap: Map<string, string>;
};

export class DocsComposer {
  specs: Partial<OpenAPI.Document> = {};
  pathsMap: Map<string, string> = new Map();

  constructor() {
    this.specs = this._createSchema();
    this.pathsMap = new Map();
  }

  protected _createSchema(): Partial<OpenAPI.Document> {
    return {
      openapi: '3.1.0',
      paths: {},
    };
  }

  public extend (
    specs: Partial<OpenAPI.Document> | ((helpers: DocsExtendHelpers) => Partial<OpenAPI.Document>)
  ): DocsComposer 
  {
    if (typeof specs === 'function') {
      const callbackSpecs = specs({ pathsMap: this.pathsMap });
      this.specs = merge(this.specs, callbackSpecs);
    } else {
      this.specs = merge(this.specs, specs);
    }
    return this;
  }

  public extendsPaths (
    pathsObject: OpenAPI.PathsObject | ((helpers: DocsExtendHelpers) => OpenAPI.PathsObject)
  ): DocsComposer 
  {
    if (typeof pathsObject === 'function') {
      const callbackPaths = pathsObject({ pathsMap: this.pathsMap });
      this.specs.paths = merge(this.specs.paths, callbackPaths);
    } else {
      this.specs.paths = merge(this.specs.paths, pathsObject);
    }
    return this;
  }

  public merge(specs: Document): Document 
  {
    return merge(specs, this.specs) as Document;
  }
}