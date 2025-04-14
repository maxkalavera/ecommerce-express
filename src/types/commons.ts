

export type GenericObject = {
  [key: string]: any
}

export type WithTarget<Source> = {
  [K in keyof Source]: (
    Source[K] extends (...args: infer Args) => infer Return
      ? (target: WithTarget<Source>, ...args: Args) => Return
      : Source[K]
  )
};

export type WithoutTarget<Source> = {
  [K in keyof Source]: (
    Source[K] extends (...args: infer Args) => infer Return
     ? (...args: Args extends [any, ...infer Rest] ? Rest : never) => Return
      : Source[K]
  )
}
