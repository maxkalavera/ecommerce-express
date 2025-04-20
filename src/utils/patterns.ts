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

type UnionToIntersection<U> = (
  (
    U extends any ? 
      (k: U) => void : 
      never
  ) extends (k: infer I) => void 
    ? I 
    : never
);

type Prioritize<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends object
    ? Rest extends any[]
      ? PrioritizeHelper<First, Prioritize<Rest>>
      : never
    : never
  : {};

type PrioritizeHelper<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U ? U[K] : K extends keyof T ? T[K] : never;
};

export type AttachMixins<
  Receiver extends GenericObject,
  Mixins extends [...(GenericObject[])],
> = Prioritize<[Receiver, ...Mixins]>;

export function attachMixins<
  Receiver extends GenericObject,
  Mixins extends [...(GenericObject[])],
> (
  receiver: Receiver, 
  ...mixins: Mixins
): Receiver & UnionToIntersection<Mixins[number]>
{
  return Object.assign(receiver, ...mixins);
};
