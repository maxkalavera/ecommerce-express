import { Request, Response, NextFunction } from 'express';
import { GenericObject } from "@/types/commons";
import { ValidateReturned, CommitReturned } from "@/utils/controllers/mixins/crud/types";
import { buildMixin } from "@/utils/patterns";
import { controllersBaseMixin } from "@/utils/controllers/mixins/base";

/******************************************************************************
 * Types
 *****************************************************************************/

export type UpdateMixin = {
  lookUpAttribute: string;
  validateUpdate: <
    CleanedData extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<ValidateReturned<CleanedData>>;
  commitUpdate: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CommitReturned<ResponsePayload>>;
  update: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
};

export type PatchMixin = {
  lookUpAttribute: string;
  validatePatch: <
    CleanedData extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<ValidateReturned<CleanedData>>;
  commitPatch: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CommitReturned<ResponsePayload>>;
  patch: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
};

/******************************************************************************
 * Mixins
 *****************************************************************************/

export const updateMixin = buildMixin<
  UpdateMixin,
  [typeof controllersBaseMixin]
>({
  lookUpAttribute: "id",
  validateUpdate: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        cleanedData: {},
        success: true
      };
    }, next);
  },
  commitUpdate: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  update: async (target, req, res, next) => {
    try {
      const data = await target.validateUpdate(req.body, next);
      if (data !== undefined) {
        const instance = await target.commitUpdate(data, next);
        if (instance !== undefined) {
          return res.status(200).json(instance);
        } else {
          return res.status(400).json({ error: 'Bad Request' });
        }
      } else {
        return res.status(400).json({ error: 'Bad Request' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}, [controllersBaseMixin]);

export const patchMixin = buildMixin<
  PatchMixin,
  [typeof controllersBaseMixin]
>({
  lookUpAttribute: "id",
  validatePatch: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        cleanedData: {},
        success: true
      };
    }, next);
  },
  commitPatch: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  patch: async (target, req, res, next) => {
    try {
      const data = await target.validatePatch(req.body, next);
      if (data !== undefined) {
        const instance = await target.commitPatch(data, next);
        if (instance !== undefined) {
          return res.status(200).json(instance);
        } else {
          return res.status(400).json({ error: 'Bad Request' });
        }
      } else {
        return res.status(400).json({ error: 'Bad Request' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}, [controllersBaseMixin]);