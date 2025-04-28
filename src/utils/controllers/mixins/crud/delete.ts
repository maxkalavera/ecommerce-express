import { Request, Response, NextFunction } from 'express';
import { GenericObject } from "@/types/commons";
import { CommitReturned } from "@/utils/controllers/mixins/crud/types";
import { buildMixin } from "@/utils/patterns";
import { controllersBaseMixin } from "@/utils/controllers/mixins/base";

/******************************************************************************
 * Types
 *****************************************************************************/

export type DeleteMixin = {
  lookUpAttribute: string;
  commitDelete: <
    ResponsePayload extends GenericObject
  > (data: GenericObject, next: NextFunction) 
    => Promise<CommitReturned<ResponsePayload>>;
  delete: (req: Request, res: Response, next: NextFunction) 
    => Response | Promise<Response>;
};

/******************************************************************************
 * Mixins
 *****************************************************************************/

export const deleteMixin = buildMixin<
  DeleteMixin,
  [typeof controllersBaseMixin]
>({
  lookUpAttribute: "id",
  commitDelete: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  delete: async (target, req, res, next) => {
    try {
      const { success } = await target.commitDelete(req.params, next);
      if (success) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: 'Not Found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}, [controllersBaseMixin]);