
/******************************************************************************
 * Types
 *****************************************************************************/

export type Mutator<
  Structure extends Record<string, any> = Record<string, any>,
  Target extends Record<string, any> = Record<string, any>,
  Source extends Structure = Structure,
> = (
  source: Source,
) => Target;

export type Mixin<
  Structure extends Record<string, any> = Record<string, any>,
  Target extends Record<string, any> = Record<string, any>,
  Source extends Structure = Structure,
> = (
  source: Source,
) => MergeObjects<Source, Target>;


export type Nomad = {
  mutate: (
    mutator: (source: Record<string, any>) => Record<string, any>
  ) => Nomad;
  [key: string]: any;
};

export type MergeObjects<T, U> = {
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

export type MergeObjectsList<T extends any[]> = Resolve<(
  T extends [infer First, ...infer Rest]
    ? First extends Record<string, any>
      ? Rest extends any[]
        ? MergeObjects<First, MergeObjectsList<Rest>>
        : never
      : never
    : {}
)>;

export type ReturnTypesOf<
  T extends Array<(...args: any[]) => any>
> = {
  [K in keyof T]: (
    T[K] extends (...args: any[]) => infer R ? R : never
  );
};

export type Resolve<
  T extends Record<string, any>
> = (
  T extends infer U 
    ? { 
      [K in keyof U]: U[K] 
    } 
    : never

);

/******************************************************************************
 * Utils
 *****************************************************************************/


/**
 * buildNomad creates a wrapper object that allows chaining mutations on the source data
 * while maintaining type safety. It adds `mutate` and `toObject` methods to the source.
 * 
 * The Structure generic parameter defines the shape that all mutations must conform to.
 * 
 * @example
 * // Define a base structure type
 * type UserStructure = {
 *   name?: string;
 *   age?: number;
 * }
 * 
 * // Create a wrapper that enforces the UserStructure type
 * function buildUserNomad<
 *   Source extends UserStructure
 *   Structure extends Record<string, any> = UserStructure,
 * >(source: Source) {
 *   return buildNomad<Source, Structure>(source);
 * }
 */

export function buildNomad<
  Source extends Structure,
  Structure extends Record<string, any> = Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    mutate<
      Target extends Structure,
    > (mutator: (source: Source) => Target) {
      const mutatedSource = mutator(source);
      return buildNomad<Target, Structure>(mutatedSource);
    },
    toObject () {
      if (
        typeof source.toObject === "function" ||
        typeof source.mutate === "function"
      ) {
        throw new Error('"this" object is not a nomad object')
      }
      const { mutate, toObject, ...object} = this;
      return object as unknown as Resolve<Omit<Source, "mutate" | "toObject">>;
    },
  }
};

export function buildExclicitNomad<
  Structure extends Record<string, any> = Record<string, any>,
> (
  source: Structure,
) {
  return {
    ...source,
    mutate (mutator: (source: Structure) => Structure) {
      const mutatedSource = mutator(source);
      return buildExclicitNomad<Structure>(mutatedSource);
    },
    toObject () {
      if (
        typeof source.toObject === "function" ||
        typeof source.mutate === "function"
      ) {
        throw new Error('"this" object is not a nomad object')
      }
      const { mutate, toObject, ...object} = this;
      return object as unknown as Resolve<Omit<Structure, "mutate" | "toObject">>;
    },
  }
};
