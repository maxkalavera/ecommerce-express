import * as op from 'drizzle-orm';
import CoreAccessor, { type BuildQueryOptions } from '@/utils/accessors/CoreAccessor';
import { products, productsItems, productsImages } from '@/models/products';
import { categoriesAccessor } from '@/accessors/categories';
import { ImageAccessorComposer } from '@/utils/accessors/ImageAccessorComposer';
import {
  ProductsInsert, ProductsUpdate, 
  ProductsItemsInsert, ProductsItemsUpdate, ProductItemsQueryParams,
  ProductsImagesInsert, ProductsImagesUpdate, ProductsImagesQueryParams
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

  async create(
    data: Record<string, any>
  ) {
    let { categoryId, categoryKey } = data;
    if (categoryKey && !categoryId) {
      const categoryPayload = await categoriesAccessor.read({ key: categoryKey });
      if (!categoryPayload.isSuccess()) {
        throw this.buildError({
          sensitive: { message: `Category ${categoryKey} could not get retrieved` }
        }, categoryPayload.getError());
      }
      const category = categoryPayload.getPayload().data;
      categoryId = category.id;
    }

    return await super.create({
      ...data,
      categoryId: categoryId,
      categoryKey: categoryKey,
    });
  }

  protected buildQuerySelectFields() {
    return {
      ...this.table as Record<string, any>,
      isFavorite: productsItems.isFavorite,
      isOnCart: productsItems.isOnCart,
      quantity: productsItems.quantity,
      size: productsItems.size,
    };
  }

  protected buildQueryBaseSelect () {
    return this.db
     .select(this.buildQuerySelectFields())
     .from(this.table)
     .leftJoin(productsItems, op.eq(products.id, productsItems.productId));
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
        queryParamsSchema: ProductItemsQueryParams,
      }
    );
  }

  protected buildQuerySelectFields() {
    return {
      id: this.table.id,
      key: this.table.key,
      createdAt: this.table.createdAt,
      updatedAt: this.table.updatedAt,
      isFavorite: this.table.isFavorite,
      isOnCart: this.table.isOnCart,
      quantity: this.table.quantity,
      size: this.table.size,
      productId: this.table.productId,

      name: products.name,
      description: products.description,
      price: products.price,
      color: products.color,
      colorHex: products.colorHex,
      isLabeled: products.isLabeled,
      labelContent: products.labelContent,
      labelColor: products.labelColor,
    };
  }

  protected buildQueryBaseSelect() {
    return this.db
      .select(this.buildQuerySelectFields())
      .from(this.table)
      .leftJoin(products, op.eq(productsItems.productId, products.id));
  }


  protected buildQueryWhere(
    query: Record<string, any>,
    options: BuildQueryOptions
  ) {
    const conditions = super.buildKeyQueryWhere(query, options);
    const { search, newArrivals, category, color, size, fromPrice, toPrice } = query;

    if (typeof search === 'string' && search.length >= 3) {
      conditions.push(
        op.or(
          op.ilike(products.name, op.sql`'%' || ${search} || '%'`),
          op.ilike(products.description, op.sql`'%' || ${search} || '%'`),
          op.ilike(products.color, op.sql`'%' || ${search} || '%'`),
          op.ilike(productsItems.size, op.sql`'%' || ${search} || '%'`),
        )
      );
    }

    if (typeof newArrivals === 'boolean' && newArrivals) {
      conditions.push(
        op.gte(products.createdAt, op.sql`NOW() - INTERVAL '2 weeks'`)
      );
    }

    if (typeof category === 'string' && category) {
      conditions.push(
        op.eq(products.categoryKey, category)
      );
    }

    if (typeof color === 'string' && color) {
      conditions.push(
        op.or(
          op.eq(op.sql`LOWER(TRIM(${products.color}))`, op.sql`LOWER(TRIM(${color}))`),
          op.eq(op.sql`LOWER(${products.colorHex})`, op.sql`LOWER(${color})`)
        )
      );
    }

    if (typeof size === 'string' && size) {
      conditions.push(
        op.eq(op.sql`LOWER(${productsItems.size})`, op.sql`LOWER(${size})`)
      );
    }

    return conditions;
  }

  protected buildPaginationQueryOrderBy(
    params: Record<string, any>,
    options: BuildQueryOptions
  ): op.SQL[]
  {
    const orderBy = super.buildPaginationQueryOrderBy(params, options);
    return orderBy;
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
        queryParamsSchema: ProductsImagesQueryParams,
      }
    );
  }

  protected buildQuerySelectFields() {
    return {
      ...this.table as Record<string, any>,
    }
  }

  protected buildQueryBaseSelect() {
    return this.db
      .select(this.buildQuerySelectFields())
      .from(this.table);
  }

  protected buildQueryWhere(
    query: Record<string, any>,
    options: BuildQueryOptions
  ) {
    const conditions = super.buildKeyQueryWhere(query, options);

    if (query.productId !== undefined) {
      conditions.push(op.eq(this.table.productId, query.productId));
    }

    if (query.productsIds !== undefined) {
      conditions.push(op.inArray(this.table.productId, query.productsIds))
    }

    return conditions;
  }

}
export const productsImagesAccessor = new ProductsImagesAccessor();
