import { GenericObject } from "@/types/commons";

/******************************************************************************
 * Context Binding pattern types
 *****************************************************************************/

export type Contextualized<
  Context extends GenericObject=GenericObject,
> = {
  [key: string]: 
    | ((...args: [Context, ...any[]]) => any)
    | (string | number | boolean | null | undefined | symbol | bigint)
    | GenericObject;
};

export type ExtractContext<T> = T extends {
  [key: string]: 
    | ((...args: [infer Output, ...any[]]) => any)
    | (string | number | boolean | null | undefined | symbol | bigint)
    | GenericObject;
  } ? Output : never;

export type ValidateContext<
  Type extends Contextualized<Context>,
  Context extends GenericObject=GenericObject,
> = Type;

export type WithContext<
  Type extends GenericObject, 
  Context extends GenericObject=GenericObject,
> = {
  [K in keyof Type]: (
    Type[K] extends (...args: infer Args) => infer Return
      ? (...args: [Context, ...Args]) => Return
      : Type[K]
  )
};

export type WithoutContext<Type> = {
  [K in keyof Type]: (
    // First extends to separate union types
    Type[K] extends infer Attribute 
      ? (
        Attribute extends (...args: infer Args) => infer Return
          // Remove the first argument from the function signature
          ? (...args: Args extends [any,...infer Rest]? Rest : never) => Return
          : Attribute
      ) 
      : never
  )
};

/******************************************************************************
 * Mixin pattern types
 *****************************************************************************/

export type MixinObject<
  Context extends GenericObject,
> = {
[key: string]: 
  | ((...args: [Context, ...any[]]) => any)
  | (string | number | boolean | null | undefined | symbol | bigint)
  | GenericObject;
};

export type MixinBuilder<
  Options extends GenericObject,
  Context extends GenericObject,
> = (options: Options) => MixinObject<Context>;

export type Mixin<
  Options extends GenericObject = any,
  Context extends GenericObject = any,
> = MixinObject<Context> | MixinBuilder<Options, Context>;

/******************************************************************************
 * Attach mixins util types */

export type AttachMixins<
  Receiver extends MixinObject<any>,
  Mixins extends [...(Mixin[])],
  OptionsObject extends GenericObject = MixinOptionsFromMixins<Mixins>,
> = MixinsToMixinObjects<OptionsObject, Mixins>

const mixins = [
  { a: 0 },
  { b: 1 },
  ((options) => ({ c: 2 })) as MixinBuilder<{ defaultA: number }, { c: number }>, 
  ((options) => ({ d: 3 })) as MixinBuilder<{ defaultB: number }, { d: number }>
];
type test2 = MixinsToMixinObjects<{}, typeof mixins>;
type test3 = AttachMixins<{}, typeof mixins>;

export type AttachMixinsObjects<
  Receiver extends MixinObject<any>,
  Mixins extends [...(MixinObject<any>[])],
> = Prioritize<[Receiver, ...Mixins]>;

export type AttachMixinsBuilders<
  Options extends GenericObject,
  Receiver extends MixinObject<any>,
  Mixins extends [...(MixinBuilder<Options, any>[])],
> = Prioritize<[Receiver, ...(MixinBuilderResults<Options, Mixins>)]>;

export type MixinBuilderResults<
  Options extends GenericObject,
  Builders extends [...MixinBuilder<Options, any>[]]
> = {
  [K in keyof Builders]: Builders[K] extends MixinBuilder<Options, GenericObject>
    ? ReturnType<Builders[K]>
    : never
};

export type MixinsToMixinObjects<
  OptionsObject extends GenericObject,
  Mixins extends [...(Mixin[])],
> = {
  [K in keyof Mixins]: Mixins[K] extends MixinBuilder<OptionsObject, any>
    ? ReturnType<Mixins[K]>
    : Mixins[K]
};

export type MixinOptionsFromMixins<
  Mixins extends [...(Mixin[])],
> = Prioritize<{
  [key in keyof Mixins]: Mixins[key] extends MixinBuilder<infer Options, any>
    ? Options
    : {}
}>;

/******************************************************************************
 * extend mixins util types */

export type ExtendMixinObject<
  Target extends GenericObject,
  Base extends MixinObject<any>,
> = Prioritize<[Base, Target]>;

export type ValidateMixinObject<
  Type extends Mixin<Context>,
  Context extends GenericObject=GenericObject,
> = Type;

export type ToMixinObject<
  Type extends GenericObject,
  Context extends GenericObject = (
    & Type
    & GenericObject
  )
> = (
  ValidateMixinObject<
    WithContext<Type, Context>,
    Context
  >
);

/******************************************************************************
 * Common pattern util types
 *****************************************************************************/

/**
 * Prioritize type merges a tuple of objects while preserving property precedence
 * @template T - Tuple of object types to merge
 * @description 
 * - Processes objects in order (first object has highest priority)
 * - Preserves type safety while combining multiple objects
 * - Returns a single merged type where earlier objects take precedence
 */
type Prioritize<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends object
    ? Rest extends any[]
      ? PrioritizeHelper<First, Prioritize<Rest>>
      : never
    : never
  : {};

/**
 * Helper type for Prioritize that performs the actual property merging
 * @template T - Current object being processed
 * @template U - Accumulated result from processing remaining objects
 * @description
 * - Merges properties from T and U
 * - Properties from T take precedence over U when names conflict
 * - Preserves all non-conflicting properties from both types
 */
type PrioritizeHelper<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U ? U[K] : K extends keyof T ? T[K] : never
};