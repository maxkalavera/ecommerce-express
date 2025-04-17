import { GenericObject } from "@/types/commons";
import { Contextualized, WithoutContext } from "@/types/patterns";

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

type UnionToIntersection<U> = 
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void 
    ? I 
    : never;

export function attachMixins<
  Receiver extends { [key: string]: any; },
  Mixins extends [...({ [key: string]: any; }[])],
> (
  receiver: Receiver, 
  ...mixins: Mixins
): Receiver & UnionToIntersection<Mixins[number]>
{
  return Object.assign(receiver, ...mixins);
};
