import { buildServiceController } from "@/controllers/utils/utils";
import { withCRUD } from "@/controllers/mixins/crud";
import { categoriesService } from "@/services/categories";

export const categoriesController = buildServiceController({
  service: categoriesService,
}).mutate(withCRUD);
