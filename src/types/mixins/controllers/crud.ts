import { Request, Response, NextFunction } from 'express';
import { GenericObject } from "@/types/commons";

export type ValidateReturned<
  CleanedData extends GenericObject
> = {
  cleanedData: CleanedData;
  success: boolean;
};

export type CommitReturned<
  ResponsePayload extends GenericObject
> = {
  responsePayload: ResponsePayload;
  success: boolean;
};

export type CreateMixin = {
  validateCreate: <
    CleanedData extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<ValidateReturned<CleanedData>>;
  commitCreate: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CommitReturned<ResponsePayload>>;
  create: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
};

/*


export type CreateMixin = ToMixinObject<{
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

export type ReadMixin = ToMixinObject<{
  lookUpAttribute: string;
  commitRead: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDCommitReturned<ResponsePayload>>;
  read: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
}>;

export type ReadAllMixin = ToMixinObject<{
  commitReadAll: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDCommitReturned<ResponsePayload>>;
  readAll: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
}>;

export type UpdateMixin = ToMixinObject<{
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

export type PatchMixin = ToMixinObject<{
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

export type DeleteMixin = ToMixinObject<{
  lookUpAttribute: string;
  commitDelete: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CRUDCommitReturned<ResponsePayload>>;
  delete: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
}>;
*/
