import { GenericObject, IsUnion, Prioritize, RemoveUndefined, RemoveUndefinedFromObjectTuple, UnionToTuple } from "@/types/commons";

/******************************************************************************
 * Context Binding pattern types
 *****************************************************************************/

export type AttachContext<
  Type extends Mixin<any, any>,
  Context extends GenericObject=GenericObject,
> = (
  Type extends MixinBuilder<any, any>
    ? (...args: Parameters<Type>) => WithContext<ReturnType<Type>, Context>
    : WithContext<Type, Context>
);

export type RemoveContext<
  Type extends Mixin<any, any>,
> = (
  Type extends MixinBuilder<any, any>
    ? (...args: Parameters<Type>) => WithoutContext<ReturnType<Type>>
    : WithoutContext<Type>
);

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
  Receiver extends GenericObject,
  Mixins extends Mixin<any, any>[]
> = (
  Prioritize<
    RemoveUndefinedFromObjectTuple<
      MixinsToMixinObjects<
        [Receiver, ...UnionToTuple<Mixins[number]>]
  >>>
);

export type MixinsToMixinObjects<
  MixinsTuple extends [...any[]]
> = {
  [key in keyof MixinsTuple]: (
    MixinsTuple[key] extends MixinBuilder<any, any>
     ? ReturnType<MixinsTuple[key]>
     : MixinsTuple[key]
  )
};

export type MergeOptionsFromMixins<
  Mixins extends [...Mixin[]],
  MixinTuple extends [...any[]] = UnionToTuple<Mixins[number]>
> = Prioritize<RemoveUndefinedFromObjectTuple<{
  [key in keyof MixinTuple]: MixinTuple[key] extends MixinBuilder<infer Options, any>
    ? Options
    : {}
}>>;

export type ToMixinObject<
  T extends MixinObject<any>,
  Context extends GenericObject = GenericObject,
> = {
  [K in keyof T]: (
    T[K] extends (...args: infer Args) => infer Return
      ? (...args: [Context, ...Args]) => Return
      : T[K]
  )
};

export type test = ToMixinObject<{
  test: (a: string) => string;
  test2: string;
}>