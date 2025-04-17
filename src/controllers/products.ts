import { buildController, CRUDMixins } from "@/controllers/commons";
import { CRUDMixinEnum } from "@/types/controllers";


export const productsController = buildController({
  create: async (target, req, res, next) => {
    return {
      message: 'create',
    };
  },
});
