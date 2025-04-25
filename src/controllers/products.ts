import { createMixin } from "@/utils/controllers/mixins/crud";
import { buildController } from "@/controllers/commons";

export const productsController = buildController({}, [createMixin]);
