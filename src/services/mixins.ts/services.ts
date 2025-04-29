
import { Model as ModelType } from "@/models/commons";
import { productsModel } from "@/models/products";
import { buildMixin } from "@/utils/patterns";

export function buildModelServiceMixin<
  Model extends ModelType<any, any, any, any>,
> (
  model: Model
) {
  return buildMixin ({
    
  });
}

const productsService = buildModelServiceMixin(productsModel);