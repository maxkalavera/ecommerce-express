import { buildController } from "@/controllers/commons";
import { all, createMixin } from "@/controllers/mixins/crud";
import { ControllerMixin } from "@/types/controllers";

export const productsController = buildController({
  create: async (target, req, res, next) => {
    return {
      message: 'create',
    };
  },
}, createMixin);