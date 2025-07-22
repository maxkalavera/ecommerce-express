import express, { Router } from 'express';
import { LayersCore } from '@/utils/layers/LayersCore';


export class CoreController extends LayersCore {
  protected resourceName: String;
  protected router: Router;

  constructor (resourceName: string) {
    super();
    this.resourceName = resourceName;
    this.router = express.Router();
  }

  public register(router: Router) {
    this.addRoutes();
    router.use(`/${this.resourceName}`, this.router);
  }

  protected addRoutes() {}

}