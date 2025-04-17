import { buildController } from "@/controllers/commons";
import { all } from "@/controllers/mixins/crud";

export const productsController = buildController({
  create: async (target, req, res, next) => {
    return {
      message: 'create',
    };
  },
}, ...all);
