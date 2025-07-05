import express, { Router } from 'express';
import { LayersCore } from '@/utils/layers/LayersCore';
import { DocsComposer } from '@/utils/controllers/DocsComposer';


export class CoreController extends LayersCore {
  protected resourceName: String;
  protected router: Router;
  public docs = new DocsComposer();

  constructor (resourceName: string) {
    super();
    this.resourceName = resourceName;
    this.router = express.Router();
  }

  public register(router: Router) {
    this._addRoutes();
    router.use(`/${this.resourceName}`, this.router);
  }

  protected _addRoutes() {}

}