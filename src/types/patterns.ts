import { GenericObject, Prioritize, RemoveUndefinedFromObjectTuple, UnionToTuple } from "@/types/commons";

/******************************************************************************
 * Mixin patterns
 *****************************************************************************/

export type Target = GenericObject;
export type Context = GenericObject;

export type Mixin<
  SelfTarget extends Target,
  SelfContext extends Context = {},
> = WithContext<SelfTarget, MergeObjects<[SelfTarget, SelfContext]> & GenericObject>;

export type MixinBuilder<
  SelfTarget extends Target,
  Options extends GenericObject = GenericObject,
  SelfContext extends Context = {},
> = (Options: Options) => Mixin<SelfTarget, SelfContext>;

export type ExtractTarget<
  SelfMixin extends Mixin<any, any>
> = (
  WithoutContext<SelfMixin>
);

export type ExtractTargets<
  SelfMixins extends Mixin<any, any>[],
  MixinsTuple extends any[] = UnionToTuple<SelfMixins[number]>
> = (
  MixinsTuple extends [infer Head, ...infer Tail]
    ? (
      Head extends Mixin<any, any>
        ? [ExtractTarget<Head>, ...ExtractTargets<Tail extends Mixin<any, any>[]? Tail : []>]
        : []
    )
    : []
)

type Mixin1 = Mixin<{ foo: () => void; }, {}>;
type Mixin2 = Mixin<{e: number, f: string}, {}>;
type test = ExtractTargets<[
  Mixin1,
  Mixin2,
]>;

/*
(
  SelfMixins extends [infer Head, ...infer Tail]
    ? (
      Head extends Mixin<any, any>
        ? [ExtractTarget<Head>, ...ExtractTargets<Tail extends Mixin<any, any>[]? Tail : []>]
        : []
    )
    : []
);
*/

/******************************************************************************
 * Misc Utils
 *****************************************************************************/

export type MergeObjects<
  Objects extends GenericObject[],
> = (
  Prioritize<
    RemoveUndefinedFromObjectTuple<
      UnionToTuple<
        Objects[number]
  >>>
);

export type WithContext<
  SelfTarget extends Target, 
  SelfContext extends Context=GenericObject,
> = {
  [K in keyof SelfTarget]: (
    SelfTarget[K] extends (...args: infer Args) => infer Return
      ? (...args: [SelfContext, ...Args]) => Return
      : SelfTarget[K]
  )
};

export type WithoutContext<
  SelfTarget extends Target
> = {
  [K in keyof SelfTarget]: (
    // First extends to separate union types
    SelfTarget[K] extends infer Attribute 
      ? (
        Attribute extends (...args: infer Args) => infer Return
          // Remove the first argument from the function signature
          ? (...args: Args extends [any,...infer Rest]? Rest : never) => Return
          : Attribute
      ) 
      : never
  )
};