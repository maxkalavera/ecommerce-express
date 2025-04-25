import { Mixin, Target, WithoutContext } from "@/types/patterns";

export function buildTarget<
  SelfTarget extends Target,
  Mixins extends Mixin<any, any>[]
> (
  target: SelfTarget,
  mixins: Mixins = [] as any,
) {
  return attachContext(
    buildMixin(target, mixins),
  );
}

/******************************************************************************
 * Context patterns
 *****************************************************************************/

export function attachContext<
  MixinTemplate extends Mixin<any, any>,
> (
  mixin: MixinTemplate,
): WithoutContext<MixinTemplate> 
{
  const target = {};
  const context = target;

  return Object.entries(mixin).reduce((wrappedController, [key, value]) => {
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
};

/******************************************************************************
 * Mixin patterns
 *****************************************************************************/

export function buildMixin<
  SelfTarget extends Target,
  Mixins extends Mixin<any, any>[]
> (
  target: Mixin<SelfTarget>,
  mixins: Mixins = [] as any,
): Mixin<SelfTarget>  
{
  return Object.assign({}, ...mixins, target);
};

