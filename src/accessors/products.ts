import { db } from "@/db";
import { productsModel, productImagesModel, productItemsModel } from "@/models/products";
import { withCRUD } from "@/accessors/mixins/crud";
import { buildModelAccessor } from "@/accessors/utils/utils";
import { ModelAccessor } from "@/accessors/utils/types";

export const productsAccessor: ModelAccessor = buildModelAccessor({
  db,
  model: productsModel,
}).mutate(withCRUD);

export const productImagesAccessor: ModelAccessor = buildModelAccessor({
  db,
  model: productImagesModel,
}).mutate(withCRUD);


export const productItemsAccessor: ModelAccessor = buildModelAccessor({
  db,
  model: productItemsModel,
}).mutate(withCRUD);