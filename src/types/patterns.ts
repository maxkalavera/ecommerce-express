import { GenericObject } from "@/types/commons";

/******************************************************************************
 * Context Binding pattern types
 */

export type Contextualized<
  Context extends GenericObject=GenericObject,
> = {
  [key: string]: 
    | ((...args: [Context, ...any[]]) => any)
    | (string | number | boolean | null | undefined | symbol | bigint);
};

export type ValidateContext<
  Type extends Contextualized<Context>,
  Context extends GenericObject=GenericObject,
> = Type;

export type WithContext<
  Type extends GenericObject, 
  Context extends GenericObject=(Type & GenericObject)
> = {
  [K in keyof Type]: (
    Type[K] extends (...args: infer Args) => infer Return
      ? (...args: [Context, ...Args]) => Return
      : Type[K]
  )
} & GenericObject;

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
    | (string | number | boolean | null | undefined | symbol | bigint);
};

export type ValidateMixin<
  Type extends Mixin<Context>,
  Context extends GenericObject=GenericObject,
> = Type;

export type ToMixin<
  Type extends GenericObject
> = WithContext<Type> & Mixin<Type & GenericObject>;

