/******************************************************************************
 * Types
 *****************************************************************************/

/**
 * A generic object type that allows any string key with any value
 * @example
 * const obj: GenericObject = { foo: 'bar', num: 42 };
 */
export type GenericObject = Record<string, any>;

/**
 * A generic function type that accepts any arguments and returns any value
 * @example
 * const fn: GenericFunction = (a, b) => a + b;
 */
export type GenericFunction = (...args: any[]) => any;
