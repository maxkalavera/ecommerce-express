import { buildService } from "@/services/commons";
import { productAccessor } from "@/accessors/products";
import { Product } from "@/models/products";

const values = {
  customMethod: async (intro: string) => {
    return await productAccessor.readAll();
  }
};

export const ProductService = buildService<Product, number, typeof values>(productAccessor, values);

ProductService.customMethod("Hello");
