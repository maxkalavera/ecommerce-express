import { sql } from "drizzle-orm";
import { BaseAccessor } from "@/accessors/commons";
import { Product } from "@/models/products";
import { Accessor } from "@/types/accessors";
import { productsTable } from '@/schema';

export const productAccessor: Accessor<Product> = { 
  ...(BaseAccessor as Accessor<Product>) 
};

productAccessor.create = async (data: Product) => {
  await productAccessor.query(sql`
    INSERT INTO products (name, price, description, isFavorite, isOnCart, isLabeled, labelContent, labelColor, displayImageId)
    VALUES (${data.name}, ${data.price}, ${data.description}, ${data.isFavorite}, ${data.isOnCart}, ${data.isLabeled}, ${data.labelContent}, ${data.labelColor}, ${data.displayImageId})
    RETURNING *
  `);
  return data;
}