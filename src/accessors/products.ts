import { buildAccessor } from "@/accessors/commons";
import { Product } from "@/models/products";
import { Accessor } from "@/types/accessors";
import { productsTable } from '@/schema';

export const productAccessor: Accessor<Product> = 
  buildAccessor<Product>(productsTable);
