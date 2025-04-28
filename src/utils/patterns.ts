import { ExtractTargets, Mixin, Target, WithoutContext } from "@/types/patterns";
import { Prioritize } from "@/types/commons";

/**
 * Builds a target (Controller, Model, any entity to solve a problem) object 
 * by combining both context binding and mixin patterns.
 * This function serves as a high-level utility that:
 * 1. Applies mixins to extend the target's functionality through composition
 * 2. Binds context to all methods to ensure proper 'this' binding
 * 
 * The resulting object can be used to solve complex problems that require
 * both shared functionality (mixins) and consistent context management.
 * 
 * @param target - The base target object to build upon
 * @param mixins - Optional array of mixin objects to incorporate
 * @returns A new object with combined functionality and bound context
 */

export function buildTarget<
  SelfTarget extends Target,
  Mixins extends Mixin<any, any>[]
> (
  target: SelfTarget,
  mixins: Mixins = [] as any,
): WithoutContext<Mixin<Prioritize<[ ...ExtractTargets<Mixins>, SelfTarget ]>>>
{
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
): Mixin<Prioritize<[ ...ExtractTargets<Mixins>, SelfTarget ]>>
{
  return Object.assign({}, ...mixins, target);
};

