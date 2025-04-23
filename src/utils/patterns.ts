import { GenericObject } from "@/types/commons";
import { 
  Mixin, 
  MixinObject, 
  MixinBuilder,
  Contextualized, 
  WithoutContext, 
  AttachMixins,
  AttachMixinsObjects, 
  ExtendMixinObject,
  MixinOptionsFromMixins, 
} from "@/types/patterns";

/******************************************************************************
 * Common pattern utilities
 */

export function buildTarget<
  Mixins extends Mixin[],
  Options extends GenericObject = MixinOptionsFromMixins<Mixins>,
> (
  mixins: Mixins,
  options: MixinOptionsFromMixins<Mixins>,
): AttachMixins<{}, Mixins, Options> //WithoutContext<AttachMixins<{}, Mixins, Options>>
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
  return controller as any;
}


const mixins = [
  { a: 0 },
  { b: 1 },
  ((options) => ({ c: 2 })) as MixinBuilder<{ defaultA: number }, { c: number }>, 
  ((options) => ({ d: 3 })) as MixinBuilder<{ defaultB: number }, { d: number }>
];
const test2 = buildTarget(
  mixins,
  { defaultA: 0, defaultB: 1 },
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
  Mixins extends [...(MixinObject<any>[])],
> (
  receiver: Receiver, 
  ...mixins: Mixins
): AttachMixinsObjects<Receiver, Mixins>
{
  return Object.assign(receiver, ...mixins);
};

export function extendMixinObject<
  Base extends MixinObject<any>,
  Target extends GenericObject,
> (
  baseMixin: Base, 
  extendMixin: Target & Partial<Base>,
): ExtendMixinObject<Target & Partial<Base>, Base>
{
  return Object.assign({}, baseMixin, extendMixin) as ExtendMixinObject<Target & Partial<Base>, Base>;
}