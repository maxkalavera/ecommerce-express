
import { Request, Response, NextFunction, Router } from 'express';
import { GenericObject } from '@/types/commons';
import { Mixin, WithContext } from '@/types/patterns';

/*******************************************************************************
 * Controllers
 ******************************************************************************/

export type ControllerBase = {
  handleErrors: <
    Callback extends (...args: any) => any,
  > (
    callback: Callback, 
    next: NextFunction
  ) => (
    Promise<ReturnType<Callback>>
  );
  registerRoutes: (router: Router, path: string) => void;
};

type Foo = <
  Callback extends (...args: any) => any,
> (
  callback: Callback
) => Promise<ReturnType<Callback>>;

const foo: Foo = async (callback) => {
  return callback();
};

const result = await foo( () => "Hello World!" );


export type ControllerBaseMixin = ToControllerMixin<ControllerBase>;

/*******************************************************************************
 * Mixins
 ******************************************************************************/

export type ControllerMixin<
  Context extends GenericObject=GenericObject
> = Mixin<Context>;

export type ValidateControllerMixin<
  Type extends ControllerMixin<Context>,
  Context extends GenericObject=GenericObject,
> = Type;

export type ToControllerMixin<
  Type extends GenericObject,
  Context extends GenericObject = (
    & Type
    & GenericObject
    & ControllerBase
  )
> = (
  ValidateControllerMixin<
    WithContext<Type, Context>,
    Context
  >
);
