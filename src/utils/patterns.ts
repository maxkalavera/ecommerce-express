import { GenericObject } from "@/types/commons";
import { 
  Mixin, 
  MixinObject, 
  WithoutContext,
  MergeOptionsFromMixins,
  AttachMixins,
} from "@/types/patterns";

/******************************************************************************
 * Common pattern utilities
 */

export function buildTarget<
  Mixins extends Mixin[],
> (
  mixins: Mixins,
  // Global options for mixins that are not provided by the mixin itself, the type is 
  // the union of all mixin options, it is placed in here to force the user to provide
  // the options for the mixins that are not provided by the mixin itself.
  options: MergeOptionsFromMixins<Mixins>,
): AttachMixins<{}, Mixins>
  {
  /*
  * Target naming here is used instead of context, because the the final builded
  * controller will be the target context to attach to every method. So target 
  * objects are objects which methods's first argument is the context.
  */
  // Split mixins into function mixins and object mixins
  const functionMixins = mixins.filter(mixin => typeof mixin === 'function');
  const objectMixins = mixins.filter(mixin => typeof mixin === 'object');
  const processedMixins = [...objectMixins, ...functionMixins.map(mixin => mixin(options))];

  const receiver = {};
  const fullTargetController = attachMixins(receiver, ...processedMixins, options as MixinObject<any>);
  const controller = bindContext(fullTargetController, fullTargetController);
  return controller as any;
}

/******************************************************************************
 * Context Binding pattern utilities
 */

export function bindContext<
  Context extends GenericObject,
  Target extends MixinObject<Context>,
> (
  target: Target = {} as Target,
  context: Context = {} as Context,
): WithoutContext<Target>
{
  return Object.entries(target).reduce((wrappedController, [key, value]) => {
    if (typeof value === 'function') {
      const func = value as (...args: unknown[]) => unknown | Promise<unknown>;
      if (func.constructor.name === 'AsyncFunction') {
        (wrappedController as any)[key] = async (...args: unknown[]) => {
          return await func(context, ...args);
        };
      } else {
        (wrappedController as any)[key] = (...args: unknown[]) => {
          return func(context,...args);
        };
      }
    } else {
      (wrappedController as any)[key] = value;
    }
    return wrappedController;
  }, target) as any;
}

/******************************************************************************
 * Mixin pattern utilities
 */

export function buildMixin<
  Target extends Mixin<GenericObject, GenericObject>,
  Mixins extends [...Mixin<any, any>[]] = [],
> (
  target: Target,
  mixins: Mixins = [] as any,
): AttachMixins<Target, Mixins>
{
  return Object.assign(target, ...mixins);
};

export function attachMixins<
  Receiver extends GenericObject,
  Mixins extends Mixin<any, any>[],
> (
  receiver: Receiver,
  ...mixins: Mixins
): AttachMixins<Receiver, Mixins>
{
  return Object.assign(receiver, ...mixins);
};

export function extendMixin<
  Receiver extends Mixin<any, any>,
  Mixins extends Mixin<any, any>[],
> (
  receiver: Receiver,
  ...mixins: Mixins
): AttachMixins<Receiver, Mixins>
{
  return Object.assign(receiver,...mixins);
};

