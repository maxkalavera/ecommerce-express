import { buildAccessorService } from "@/services/utils/utils";
import { categoriesAccessor } from "@/accessors/categories";
import { withCRUD } from "@/services/mixins/CRUD";

export const categoriesService = buildAccessorService({
  accessor: categoriesAccessor,
}).mutate(withCRUD);