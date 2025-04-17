import { Request, Response, NextFunction } from 'express';
import { GenericObject } from "@/types/commons";
import { ToControllerMixin } from '@/types/controllers';

export type CreateMixin = ToControllerMixin<{
  validateCreate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitCreate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  create: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>;

export type ReadMixin = ToControllerMixin<{
  commitRead: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  read: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>;

export type ReadAllMixin = ToControllerMixin<{
  commitReadAll: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  readAll: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>;

export type UpdateMixin = ToControllerMixin<{
  validateUpdate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitUpdate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  update: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>;

export type PatchMixin = ToControllerMixin<{
  validatePatch: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitPatch: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  patch: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>;

export type DeleteMixin = ToControllerMixin<{
  validateDelete: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitDelete: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  delete: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>;
