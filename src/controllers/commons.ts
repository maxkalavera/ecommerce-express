import { NextFunction } from 'express';
import { controllerBaseMixin } from '@/controllers/base';
import { attachMixins, bindContext } from '@/utils/patterns';
import { Contextualized, Mixin } from '@/types/patterns';

/*******************************************************************************
 * Controllers
 ******************************************************************************/


export function buildController<
  Target extends Contextualized,
  Mixins extends Mixin,
> (
  target: Target,
  ...mixins: Mixins[]
) {
  /*
   * Target naming here is used instead of context, because the the final builded
   * controller will be the target context to attach to every method. So target 
   * objects are objects which methods's first argument is the context.
   */
  //const targetBaseController = buildTargetBaseController();
  const receiver = {};
  const fullTargetController = attachMixins(receiver, controllerBaseMixin, target, ...mixins);
  const controller = bindContext(fullTargetController, fullTargetController);
  return controller;
}
