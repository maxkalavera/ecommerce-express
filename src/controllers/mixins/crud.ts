import { extendMixin } from "@/utils/patterns";
import * as crud from "@/utils/controllers/mixins/crud";
import { CreateMixin } from "@/types/mixins/controllers/crud";

/******************************************************************************
 * Types
 */

interface ModelCreateMixin extends CreateMixin {
  model: any;
};

/******************************************************************************
 * Mixins
 */

export const modelCreateMixin = extendMixin(crud.createMixin, {
  model: null,
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
} as ModelCreateMixin);
