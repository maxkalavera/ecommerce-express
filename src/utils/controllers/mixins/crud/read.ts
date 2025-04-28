import { Request, Response, NextFunction } from 'express';
import { GenericObject } from "@/types/commons";
import { CommitReturned } from "@/utils/controllers/mixins/crud/types";
import { buildMixin } from "@/utils/patterns";
import { controllersBaseMixin } from "@/utils/controllers/mixins/base";

/******************************************************************************
 * Types
 *****************************************************************************/

export type ReadMixin = {
  lookUpAttribute: string;
  commitRead: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CommitReturned<ResponsePayload>>;
  read: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
};

export type ReadAllMixin = {
  commitReadAll: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CommitReturned<ResponsePayload>>;
  readAll: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
};

/******************************************************************************
 * Mixins
 *****************************************************************************/

export const readMixin = buildMixin<
  ReadMixin,
  [typeof controllersBaseMixin]
>({
  lookUpAttribute: "id",
  commitRead: async (target, data, next) => {
    return target.handleErrors(() => {
      target.lookUpAttribute;
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  read: async (target, req, res, next) => {
    try {
      const instance = await target.commitRead(req.params, next);
      if (instance) {
        return res.status(200).json(instance);
      } else {
        return res.status(404).json({ error: 'Not Found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}, [controllersBaseMixin]);


export const readAllMixin = buildMixin<
  ReadAllMixin,
  [typeof controllersBaseMixin]
>({
  commitReadAll: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  readAll: async (target, req, res, next) => {
    const instances = await target.commitReadAll(req.body, next);
    return res.status(200).json(instances);
  }
}, [controllersBaseMixin]);