import { GenericObject } from "@/types/commons";
import { 
  AttachMixinsObjects, 
  Contextualized, 
  WithoutContext, 
  Mixin, 
  ExtendMixinObject, 
  MixinObject, 
  AttachMixins
} from "@/types/patterns";

/******************************************************************************
 * Common pattern utilities
 */

export function buildTarget<
  Options extends GenericObject,
  Mixins extends [...Mixin[]],
> (
  options: Options,
  ...mixins: Mixins
): WithoutContext<AttachMixins<{}, Mixins, Options>>
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
  const fullTargetController = attachMixinsObjects(receiver, ...processedMixins, options);
  const controller = bindContext(fullTargetController, fullTargetController);
  return controller as WithoutContext<AttachMixins<{}, Mixins, Options>>;
}

const test2 = buildTarget(
  { option : 0 }, 
  (options) => ({ a: 0 }), 
  (options) => ({ b: 1 })
);


/******************************************************************************
 * Context Binding pattern utilities
 */

export function bindContext<
  Context extends GenericObject,
  Target extends Contextualized<Context>,
  Result extends {} = WithoutContext<Target>,
> (
  target: Target = {} as Target,
  context: Context = {} as Context,
): Result
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
  }, target) as unknown as Result;
}

/******************************************************************************
 * Mixin pattern utilities
 */

export function attachMixinsObjects<
  Receiver extends GenericObject,
  Mixins extends [...(MixinObject[])],
> (
  receiver: Receiver, 
  ...mixins: Mixins
): AttachMixinsObjects<Receiver, Mixins>
{
  return Object.assign(receiver, ...mixins);
};

export function extendMixinObject<
  Base extends MixinObject,
  Target extends GenericObject,
> (
  baseMixin: Base, 
  extendMixin: Target & Partial<Base>,
): ExtendMixinObject<Target & Partial<Base>, Base>
{
  return Object.assign({}, baseMixin, extendMixin) as ExtendMixinObject<Target & Partial<Base>, Base>;
}