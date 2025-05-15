
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

export function buildNomad<
  Source extends Structure,
  Structure extends Record<string, any> = Record<string, any>,
> (
  source: Source,
) {
  return {
    ...source,
    mutate: <
      Target extends Structure,
    > (mutator: (source: Source) => Target) => {
      const mutatedSource = mutator(source);
      return buildNomad<Target, Structure>(mutatedSource);
    }
  }
};

export function buildTarget<
  Source extends Structure,
  Structure extends Record<string, any> = Record<string, any>,
> (source: Source) {
  return buildNomad<Source, Structure>(source);
}
