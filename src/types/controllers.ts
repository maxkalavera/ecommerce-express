
import { ID } from "@/types/db";
import { Request, Response, NextFunction, Router } from 'express';
import { GenericObject } from '@/types/commons';

/*******************************************************************************
 * Controllers
 ******************************************************************************/

export type ControllerMethod = (...args: any) => any | Promise<any>;
export type ControllerProperty = 
  | string
  | number
  | boolean
  | null
  | undefined
  | symbol
  | bigint
  | { [key: string | number | symbol]: any };

export interface Controller {
  [key: string]: ControllerMethod | ControllerProperty;
  registerRoutes: (router: Router, path: string) => void;
};

export interface EntryControler {
  [key: string]: ControllerMethod | ControllerProperty;
}

export type MixinsParameters = [...CRUDMixinBuilder[]];

export type ControllerBuilder<
  Mixins extends [...CRUDMixinBuilder[]] = MixinsParameters
> = (
  target: EntryControler,
  mixins: Mixins
) => typeof mixins extends never[] ? Controller : Controller & ReturnType<Mixins[number]>;

export interface ControllerBuilderOptions {

}

/*******************************************************************************
 * CRUD Mixins
 ******************************************************************************/

export type CRUDMixinBuilder = 
  | CreateMixinBuilder
  | ReadMixinBuilder
  | ReadAllMixinBuilder
  | UpdateMixinBuilder
  | DeleteMixinBuilder;

export type ControllerMixin = 
  | CreateMixin 
  | ReadMixin 
  | ReadAllMixin 
  | UpdateMixin 
  | DeleteMixin;

export type CreateMixinBuilder = () => CreateMixin;
export type ReadMixinBuilder = () => ReadMixin;
export type ReadAllMixinBuilder = () => ReadAllMixin;
export type UpdateMixinBuilder = () => UpdateMixin;
export  type DeleteMixinBuilder = () => DeleteMixin;

export interface CRUDMixinBuilderEnum {
  create: CreateMixinBuilder;
  read: ReadMixinBuilder;
  readAll: ReadAllMixinBuilder;
  update: UpdateMixinBuilder;
  delete: DeleteMixinBuilder;
};

export interface CreateMixin {
  validateCreate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitCreate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  create: (req: Request, res: Response, next: NextFunction) => Promise<any>;
};

export interface ReadMixin {
  read: (req: Request, res: Response, next: NextFunction) => Promise<any>;
};

export interface ReadAllMixin {
  readAll: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}

export interface UpdateMixin {
  update: (req: Request, res: Response, next: NextFunction) => Promise<any>;    
}

export interface DeleteMixin {
  delete: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}