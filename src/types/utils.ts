import { GenericObject } from "@/types/commons";

/**
 * Merges a tuple of object types while preserving property precedence (first object has highest priority)
 * @template T - Tuple of object types to merge
 * @description 
 * - Processes objects in order (first object has highest priority)
 * - Preserves type safety while combining multiple objects
 * - Returns a single merged type where earlier objects take precedence
 * @example
 * type Merged = Prioritize<[{ foo: string }, { bar: number }]>;
 * // { foo: string, bar: number }
 */
export type Prioritize<T extends any[]> = Resolve<(
  T extends [infer First, ...infer Rest]
    ? First extends GenericObject
      ? Rest extends any[]
        ? PrioritizeHelper<First, Prioritize<Rest>>
        : never
      : never
    : {}
)>;


/**
 * Helper type for Prioritize that performs the actual property merging
 * @template T - Current object being processed
 * @template U - Accumulated result from processing remaining objects
 * @description
 * - Merges properties from T and U
 * - Properties from T take precedence over U when names conflict
 * - Preserves all non-conflicting properties from both types
 */
export type PrioritizeHelper<T, U> = {
  [K in keyof T | keyof U]: (
    K extends keyof U 
      ? U[K] 
      : (
        K extends keyof T 
          ? T[K] 
          : never
      )
  )
};

/**
 * Converts a union type to an intersection type
 * @template U - Union type to convert
 * @example
 * type Example = UnionToIntersection<{a: number} | {b: string}>;
 * // {a: number} & {b: string}
 */
export type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void 
    ? I 
    : never;

/**
 * Gets the last type in a union
 * @template T - Union type to process
 * @example
 * type Last = LastOf<'a' | 'b' | 'c'>; // 'c'
 */
export type LastOf<T> = 
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R 
    ? R 
    : never;

/**
 * Adds a type to the end of a tuple
 * @template T - Tuple type to extend
 * @template V - Type to add
 * @example
 * type Extended = Push<[1, 2], 3>; // [1, 2, 3]
 */
export type Push<T extends any[], V> = [...T, V];

/**
 * Converts a union type to a tuple type
 * @template T - Union type to convert
 * @template L - Last type in union (internal use)
 * @template N - Never flag (internal use)
 * @example
 * type Tuple = UnionToTuple<'a' | 'b' | 'c'>; // ['a', 'b', 'c']
 */
export type UnionToTuple<
  T, 
  L = LastOf<T>, 
  N = [T] extends [never] ? true : false
> = (
  true extends N ? [] : Push<UnionToTuple<Exclude<T, L>>, L>
);



export type RemoveUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

export type RemoveUndefinedFromObjectTuple<
  T extends [...any[]]
> = (
  T extends [infer First, ...infer Rest]
    ? First extends GenericObject
      ? Rest extends any[]
        ? [RemoveUndefined<First>, ...RemoveUndefinedFromObjectTuple<Rest>]
        : never
      : never
    : []
);

/**
 * Checks if a type is a union type
 * @template T - Type to check
 * @description
 * - Returns true if T is a union type
 * - Returns false if T is a single type
 * @example
 * type Test1 = IsUnion<string | number>; // true
 * type Test2 = IsUnion<string>; // false
 */
export type IsUnion<T> = 
  [T] extends [UnionToIntersection<T>] ? false : true;

/**
 * Checks if a type is a tuple type
 * @template T - Type to check
 * @description
 * - Returns true if T is a tuple
 * - Returns false if T is an array or other type
 * @example
 * type Test1 = IsTuple<[string, number]>; // true
 * type Test2 = IsTuple<string[]>; // false
 */
export type IsTuple<T> = 
  T extends readonly any[]
    ? number extends T['length']
      ? false
      : true
    : false;

/**
 * Resolves a type by creating a new object type with the same properties
 * @template T - Object type to resolve
 * @description
 * - Creates a new object type that matches the structure of T
 * - Useful for simplifying complex nested types
 * - Preserves all property names and their types
 * @example
 * type Complex = { nested: { prop: string } };
 * type Simple = Resolve<Complex>;
 * // { nested: { prop: string } }
 */

export type Resolve<
  T extends Record<string, any>
> = (
  T extends infer U 
    ? { 
      [K in keyof U]: U[K] 
    } 
    : never

);