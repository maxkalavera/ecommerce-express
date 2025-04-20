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

export type Mixin<
  Context extends GenericObject=GenericObject,
> = {
  [key: string]: 
    | ((...args: [Context, ...any[]]) => any)
    | (string | number | boolean | null | undefined | symbol | bigint)
    | GenericObject;
};

export type ValidateMixin<
  Type extends Mixin<Context>,
  Context extends GenericObject=GenericObject,
> = Type;

export type ToMixin<
  Type extends GenericObject,
  Context extends GenericObject = (
    & Type
    & GenericObject
  )
> = (
  ValidateMixin<
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

export type AttachMixins<
  Receiver extends GenericObject,
  Mixins extends [...(GenericObject[])],
> = Prioritize<[Receiver, ...Mixins]>;
