import deepmerge from '@fastify/deepmerge';
import { Document } from '@/openapi';

const merge = deepmerge({ all: true });

export class DocsComposer {
  specs: Partial<Document> = {};

  extend (docs: Partial<Document>) {
    this.specs = merge(this.specs, docs);
  }

  merge(specs: Document): Document 
  {
    return merge(specs, this.specs) as Document;
  }
}