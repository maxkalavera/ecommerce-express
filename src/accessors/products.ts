import * as op from 'drizzle-orm';
import { db } from '@/db';
import CoreAccessor from '@/utils/accessors/CoreAccessor';
import { products, productsItems, productsItemsImages } from '@/models/products';
import { ImageAccessorComposer } from '@/utils/accessors/ImageAccessorComposer';
import {
  ProductsInsert, ProductsUpdate, 
  ProductsItemsInsert, ProductsItemsUpdate,
  ProductsItemsImagesInsert, ProductsItemsImagesUpdate
} from "@/typebox/accessors/products";


/******************************************************************************
 * Products
 *****************************************************************************/

export class ProductsAccessor extends CoreAccessor {
  constructor () {
    super(
      products,
      {
        insertSchema: ProductsInsert,
        updateSchema: ProductsUpdate,
      }
    );
  }
}
export const productsAccessor = new ProductsAccessor();

/******************************************************************************
 * Products items
 *****************************************************************************/

export class ProductsItemsAccessor extends CoreAccessor {
  constructor () {
    super(
      productsItems,
      {
        insertSchema: ProductsItemsInsert,
        updateSchema: ProductsItemsUpdate,
      }
    );
  }
}
export const productsItemsAccessor = new ProductsItemsAccessor();

/******************************************************************************
 * Products items images
 *****************************************************************************/

export class ProductsItemsImagesAccessor extends CoreAccessor {
  public images = new ImageAccessorComposer(this);

  constructor () {
    super(
      productsItemsImages,
      {
        insertSchema: ProductsItemsImagesInsert,
        updateSchema: ProductsItemsImagesUpdate,
      }
    );
  }

}
export const productsItemsImagesAccessor = new ProductsItemsImagesAccessor();
