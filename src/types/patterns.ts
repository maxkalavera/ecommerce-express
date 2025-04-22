import { GenericObject } from "@/types/commons";

/******************************************************************************
 * Context Binding pattern types
 */

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
 */

export type MixinObject<
  Context extends GenericObject=GenericObject,
> = {
[key: string]: 
  | ((...args: [Context, ...any[]]) => any)
  | (string | number | boolean | null | undefined | symbol | bigint)
  | GenericObject;
};

export type MixinBuilder<
  Options extends GenericObject,
  Context extends GenericObject = GenericObject,
> = (options: Options) => MixinObject<Context>;

export type MixinBuilderResults<
  Options extends GenericObject,
  Builders extends [...MixinBuilder<Options>[]]
> = {
  [K in keyof Builders]: Builders[K] extends MixinBuilder<Options, infer Context>
    ? ReturnType<Builders[K]>
    : never
};

export type Mixin<
  Options extends GenericObject = GenericObject,
  Context extends GenericObject=GenericObject,
> = MixinObject | MixinBuilder<Options, Context>;

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

export type AttachMixinsObjects<
  Receiver extends MixinObject,
  Mixins extends [...(MixinObject[])],
> = Prioritize<[Receiver, ...Mixins]>;

export type AttachMixinsBuilders<
  Options extends GenericObject,
  Receiver extends MixinObject,
  Mixins extends [...(MixinBuilder<Options>[])],
> = Prioritize<[Receiver, ...(MixinBuilderResults<Options, Mixins>)]>;

export type MixinsToMixinObjects<
OptionsObject extends GenericObject,
  Mixins extends [...(Mixin[])],
> = {
  [K in keyof Mixins]: Mixins[K] extends MixinBuilder<OptionsObject>
    ? ReturnType<Mixins[K]>
    : Mixins[K]
};

export type AttachMixins<
  Receiver extends MixinObject,
  Mixins extends [...(Mixin[])],
  OptionsObject extends GenericObject,
  MixinObjects extends [...(MixinObject[])] = (
    MixinsToMixinObjects<OptionsObject, Mixins> extends [...(MixinObject[])] ? MixinsToMixinObjects<OptionsObject, Mixins> : never
  ),
> = AttachMixinsObjects<Receiver, MixinObjects>;

export type ExtendMixinObject<
  Target extends GenericObject,
  Base extends MixinObject,
> = Prioritize<[Base, Target]>;

type test = AttachMixins<{}, [((context: {}) => { a: 0 }), ((context: {}) => { b: 1 })], {}>;

type test2 = test extends [...GenericObject[]] ? true : false;