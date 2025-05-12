import { buildServiceController } from "@/controllers/utils/utils";
import { withCRUD } from "@/controllers/mixins/crud";
import { productsService } from "@/services/products";

export const productsController = buildServiceController({
  service: productsService,
}).mutate(withCRUD);
