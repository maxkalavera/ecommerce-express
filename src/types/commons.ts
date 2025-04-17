

export type GenericObject = {
  [key: string]: 
    | ((...args: any) => any)
    | (string | number | boolean | null | undefined | symbol | bigint)
    | GenericObject;
}
