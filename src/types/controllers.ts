
import { Request, Response, NextFunction, Router } from 'express';
import { GenericObject } from '@/types/commons';
import { ContextualizedObject, WithContext } from '@/types/patterns';

/*******************************************************************************
 * Controllers
 ******************************************************************************/

export type BaseController = {
  registerRoutes: (router: Router, path: string) => void;
};
export type TargetBaseController = WithContext<BaseController, GenericObject>;

/*******************************************************************************
 * CRUD Mixins
 ******************************************************************************/
/*
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
  view: ReadMixinBuilder & ReadAllMixinBuilder;
  mutate: CreateMixinBuilder & UpdateMixinBuilder & PatchMixinBuilder & DeleteMixinBuilder;
  all: CreateMixinBuilder & ReadMixinBuilder & ReadAllMixinBuilder & UpdateMixinBuilder & PatchMixinBuilder & DeleteMixinBuilder;
};

export interface CRUDMixinEnum {
  create: CreateMixin;
  read: ReadMixin;
  readAll: ReadAllMixin;
  update: UpdateMixin;
  patch: PatchMixin;
  delete: DeleteMixin;
  view: ReadMixin & ReadAllMixin;
  mutate: CreateMixin & UpdateMixin & PatchMixin & DeleteMixin;
  all: CreateMixin & ReadMixin & ReadAllMixin & UpdateMixin & PatchMixin & DeleteMixin;
}

export type CRUDMixinBuilder = CRUDMixinBuilderEnum[keyof CRUDMixinBuilderEnum];
export type CRUDMixin = CRUDMixinEnum[keyof CRUDMixinEnum];

export type ControllerMixinBuilder =
  | CRUDMixinBuilder;
export type ControllerMixin = 
  | CRUDMixin;

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
*/

/*******************************************************************************
 * Utils
 ******************************************************************************/

/*
type MixinBuildersToMixins<T extends readonly any[]> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never;
};

type mixins = [ReadMixin, ReadAllMixin];
type controller = Controller<mixins>;
*/

