
import { NextFunction, Router } from 'express';
import { ToMixinObject } from '@/types/patterns';

/*******************************************************************************
 * Controllers
 ******************************************************************************/

export type ControllerBase = {
  basePath: string;
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

export type ControllerBaseMixin = ToMixinObject<ControllerBase>;

/*******************************************************************************
 * Mixins
 ******************************************************************************/
/*
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
  )
> = (
  ValidateControllerMixin<
    WithContext<Type, Context>,
    Context
  >
);
*/