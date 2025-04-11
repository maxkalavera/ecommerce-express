import { buildModelService } from "@/services/commons";
import { productAccessor } from "@/accessors/products";
import { Product } from "@/models/products";

export const ProductService = buildModelService<Product>(productAccessor);
