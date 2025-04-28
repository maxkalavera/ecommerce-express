import { createMixin } from "@/controllers/mixins/crud";
import { buildController } from "@/controllers/commons";

export const productsController = buildController({
  label: "Hello world!",
}, [createMixin]);

productsController.label