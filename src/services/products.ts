import { buildService } from "@/services/commons";
import { productAccessor } from "@/accessors/products";
import { Product } from "@/models/products";
import { EntryService } from "@/types/services";

export const ProductService = buildService<Product>(productAccessor);
