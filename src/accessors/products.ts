import * as op from 'drizzle-orm';
import CoreAccessor from '@/utils/accessors/CoreAccessor';
import { products, productsItems, productsImages } from '@/models/products';
import { ImageAccessorComposer } from '@/utils/accessors/ImageAccessorComposer';
import {
  ProductsInsert, ProductsUpdate, 
  ProductsItemsInsert, ProductsItemsUpdate,
  ProductsImagesInsert, ProductsImagesUpdate
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

export class ProductsImagesAccessor extends CoreAccessor {
  public images = new ImageAccessorComposer(this);

  constructor () {
    super(
      productsImages,
      {
        insertSchema: ProductsImagesInsert,
        updateSchema: ProductsImagesUpdate,
      }
    );
  }

}
export const productsImagesAccessor = new ProductsImagesAccessor();
