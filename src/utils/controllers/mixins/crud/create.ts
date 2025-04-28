import { GenericObject } from "@/types/commons";
import { NextFunction, Request, Response } from "express";
import { ValidateReturned, CommitReturned } from "@/utils/controllers/mixins/crud/types";
import { buildMixin } from "@/utils/patterns";
import { controllersBaseMixin } from "@/utils/controllers/mixins/base";

/******************************************************************************
 * Types
 *****************************************************************************/

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

/******************************************************************************
 * Mixins
 *****************************************************************************/

export const createMixin = buildMixin<
  CreateMixin,
  [typeof controllersBaseMixin]
>({
  validateCreate: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        cleanedData: {},
        success: true
      };
    }, next);
  },
  commitCreate: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  create: async (
    target, req, res, next
  ) => {
    try {
      const validated = await target.validateCreate(req.body, next);
      if (validated.success) {
        const commited = await target.commitCreate(validated.cleanedData, next);
        if (commited.success) {
          return res.status(201).json(commited.responsePayload);
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