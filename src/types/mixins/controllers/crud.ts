import { Request, Response, NextFunction } from 'express';
import { GenericObject } from "@/types/commons";
import { ValidateMixin, WithContext } from "@/types/patterns";

export type CreateMixin = ValidateMixin<WithContext<{
  validateCreate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitCreate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  create: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>>;

export type ReadMixin = ValidateMixin<WithContext<{
  commitRead: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  read: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>>;

export type ReadAllMixin = ValidateMixin<WithContext<{
  commitReadAll: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  readAll: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>>;

export type UpdateMixin = ValidateMixin<WithContext<{
  validateUpdate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitUpdate: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  update: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>>;

export type PatchMixin = ValidateMixin<WithContext<{
  validatePatch: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitPatch: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  patch: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>>;

export type DeleteMixin = ValidateMixin<WithContext<{
  validateDelete: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  commitDelete: (data: GenericObject, next: NextFunction) => Promise<void | GenericObject>;
  delete: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}>>;
