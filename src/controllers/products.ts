import { buildController } from "@/controllers/commons";
import * as crud from "@/utils/controllers/mixins/crud";
//import { ControllerOptions } from "@/types/controllers";
//import { createMixin } from "@/controllers/mixins/crud";

export const productsController = buildController([crud.createMixin], {});

productsController.validateCreate
