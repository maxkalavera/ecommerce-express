import { db } from "@/db";
import { categoriesModel } from "@/models/categories";
import { withCRUD } from "@/accessors/mixins/crud";
import { buildModelAccessor } from "@/accessors/utils/utils";

export const categoriesAccessor = buildModelAccessor({
  db,
  model: categoriesModel,
}).mutate(withCRUD);

