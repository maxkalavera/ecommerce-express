import { db } from "@/db";
import { productsModel, productImagesModel, productItemsModel } from "@/models/products";
import { withCRUD } from "@/accessors/mixins/crud";
import { buildModelAccessor } from "@/accessors/utils/utils";

export const productsAccessor = buildModelAccessor({
  db,
  model: productsModel,
}).mutate(withCRUD);

export const productImagesAccessor = buildModelAccessor({
  db,
  model: productImagesModel,
}).mutate(withCRUD);


export const productItemsAccessor = buildModelAccessor({
  db,
  model: productItemsModel,
}).mutate(withCRUD);