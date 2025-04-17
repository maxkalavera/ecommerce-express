
import { Request, Response, NextFunction, Router } from 'express';
import { GenericObject } from '@/types/commons';
import { Mixin, WithContext } from '@/types/patterns';

/*******************************************************************************
 * Controllers
 ******************************************************************************/

export type ControllerBase = {
  handleErrors: <
    ReturnType,
    Callback extends (() => void | ReturnType) = (() => void | ReturnType),
  >(
    callback: Callback, 
    next: NextFunction
  ) => (
    ReturnType extends Promise<any>
      ? never
     : void | ReturnType
  );
  registerRoutes: (router: Router, path: string) => void;
};

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

export type ControllerBaseMixin = ToControllerMixin<ControllerBase>;