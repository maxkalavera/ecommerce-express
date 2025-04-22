import { Request, Response, NextFunction } from 'express';
import { GenericObject } from "@/types/commons";
import { ToControllerMixin } from '@/types/controllers';

export type CRUDValidateReturned<
  CleanedData extends GenericObject
> = {
  cleanedData: CleanedData;
  success: boolean;
};

export type CRUDCommitReturned<
  ResponsePayload extends GenericObject
> = {
  responsePayload: ResponsePayload;
  success: boolean;
};

export type CreateMixin = ToControllerMixin<{
  validateCreate: <
    CleanedData extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDValidateReturned<CleanedData>>;
  commitCreate: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDCommitReturned<ResponsePayload>>;
  create: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
}>;

export type ReadMixin = ToControllerMixin<{
  lookUpAttribute: string;
  commitRead: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDCommitReturned<ResponsePayload>>;
  read: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
}>;

export type ReadAllMixin = ToControllerMixin<{
  commitReadAll: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDCommitReturned<ResponsePayload>>;
  readAll: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
}>;

export type UpdateMixin = ToControllerMixin<{
  lookUpAttribute: string;
  validateUpdate: <
    CleanedData extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDValidateReturned<CleanedData>>;
  commitUpdate: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDCommitReturned<ResponsePayload>>;
  update: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
}>;

export type PatchMixin = ToControllerMixin<{
  lookUpAttribute: string;
  validatePatch: <
    CleanedData extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDValidateReturned<CleanedData>>;
  commitPatch: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDCommitReturned<ResponsePayload>>;
  patch: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
}>;

export type DeleteMixin = ToControllerMixin<{
  lookUpAttribute: string;
  commitDelete: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDCommitReturned<ResponsePayload>>;
  delete: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
}>;

