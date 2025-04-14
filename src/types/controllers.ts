
import { ID } from "@/types/db";
import { Request, Response, NextFunction, Router } from 'express';
import { GenericObject, WithTarget } from '@/types/commons';

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
export type EntryControllerMethod = (target: TargetController, ...args: any) => any | Promise<any>;


/*
export interface Controller<Mixins extends [...CRUDMixinBuilder[]] = []> {
  [key: string]: ControllerMethod | ControllerProperty;
  registerRoutes: (router: Router, path: string) => void;
}
*/
export type Controller<Mixins extends [...ControllerMixin[]] = []> = {
  [key: string]: ControllerMethod | ControllerProperty;
  registerRoutes: (router: Router, path: string) => void;
} & {
  [K in keyof Mixins[number]]: Mixins[number][K];
};

export type EntryController = Partial<WithTarget<Controller>>;

export interface BaseController extends Controller {

};
export interface EntryBaseController extends WithTarget<BaseController> {

};

export type TargetController = 
  & Controller 
  & Partial<CreateMixin>
  & Partial<ReadMixin>
  & Partial<ReadAllMixin>
  & Partial<UpdateMixin>
  & Partial<DeleteMixin>;

export type MixinsParameters = [...CRUDMixinBuilder[]];
export interface ControllerBuilderOptions {};

/*******************************************************************************
 * CRUD Mixins
 ******************************************************************************/

export type CRUDMixinBuilder = 
  | CreateMixinBuilder
  | ReadMixinBuilder
  | ReadAllMixinBuilder
  | UpdateMixinBuilder
  | PatchMixinBuilder
  | DeleteMixinBuilder;

export type ControllerMixin = 
  | CreateMixin 
  | ReadMixin 
  | ReadAllMixin 
  | UpdateMixin
  | PatchMixin
  | DeleteMixin;

export type CreateMixinBuilder = () => CreateMixin;
export type ReadMixinBuilder = () => ReadMixin;
export type ReadAllMixinBuilder = () => ReadAllMixin;
export type UpdateMixinBuilder = () => UpdateMixin;
export type PatchMixinBuilder = () => PatchMixin;
export  type DeleteMixinBuilder = () => DeleteMixin;

export interface CRUDMixinBuilderEnum {
  create: CreateMixinBuilder;
  read: ReadMixinBuilder;
  readAll: ReadAllMixinBuilder;
  update: UpdateMixinBuilder;
  patch: PatchMixinBuilder;
  delete: DeleteMixinBuilder;
};

export type CreateMixin = {
  validateCreate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitCreate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  create: (req: Request, res: Response, next: NextFunction) => Promise<any>;
};

export type ReadMixin = {
  read: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}

export type ReadAllMixin = {
  readAll: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}

export type UpdateMixin = {
  validateUpdate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitUpdate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  update: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}

export type PatchMixin = {
  validatePatch: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitPatch: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  patch: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}

export type DeleteMixin = {
  delete: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}
