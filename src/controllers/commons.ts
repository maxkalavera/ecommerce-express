import { bindContext, attachMixinsObjects } from '@/utils/patterns';
import { AttachMixinsObjects, WithoutContext } from '@/types/patterns';
import { Mixin } from '@/types/patterns';
import { GenericObject } from '@/types/commons';

/*******************************************************************************
 * Controllers
 ******************************************************************************/


export function buildController<
  Mixins extends [...Mixin[]],
  Options extends GenericObject,
> (
  mixins: Mixins,
  options: Options,
  //...mixins: Mixins
): WithoutContext<AttachMixinsObjects<Options, Mixins>> 
{
  /*
   * Target naming here is used instead of context, because the the final builded
   * controller will be the target context to attach to every method. So target 
   * objects are objects which methods's first argument is the context.
   */
  const receiver = {};
  const fullTargetController = attachMixinsObjects(receiver, ...mixins, options);
  const controller = bindContext(fullTargetController, fullTargetController);
  return controller as any;
}
