import { controllerBaseMixin } from '@/controllers/base';
import { attachMixins, bindContext } from '@/utils/patterns';
import { Contextualized } from '@/types/patterns';
import { ControllerMixin } from '@/types/controllers';

/*******************************************************************************
 * Controllers
 ******************************************************************************/


export function buildController<
  Options extends Contextualized,
  Mixins extends ControllerMixin,
> (
  options: Options,
  ...mixins: Mixins[]
) {
  /*
   * Target naming here is used instead of context, because the the final builded
   * controller will be the target context to attach to every method. So target 
   * objects are objects which methods's first argument is the context.
   */
  //const targetBaseController = buildTargetBaseController();
  const receiver = {};
  const fullTargetController = attachMixins(receiver, controllerBaseMixin, options, ...mixins);
  const controller = bindContext(fullTargetController, fullTargetController);
  return controller;
}
