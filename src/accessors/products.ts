import * as op from 'drizzle-orm';
import base64url from 'base64url';
import settings from '@/settings';
import CoreAccessor, { type BuildQueryOptions } from '@/utils/accessors/CoreAccessor';
import { products, productsItems, productsImages } from '@/models/products';
import { categories, categoriesImages } from '@/models/categories';
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

  async update(
    params: Record<string, any>,
    data: Record<string, any>
  ) {
    return await super.update(params, {
      ...data,
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

  /****************************************************************************
   * Custom queries
   ***************************************************************************/

  public async getProductInventory(
    params: {
      productId: number;
    }
  ): ReturnType<typeof this.list> 
  {
    const query = this.db
      .select({
        productKey: productsItems.key,
        quantity: productsItems.quantity,
        size: productsItems.size,
        color: productsItems.color,
        colorHex: productsItems.colorHex,
      })
      .from(this.table)
      .leftJoin(productsItems, op.eq(products.id, productsItems.productId))
      .where(
        op.eq(this.table.id, params.productId)
      );

    let items = await query;
    // hide total number of items in db show only a max number of availability
    const max_availavility = settings.PRODUCT_MAX_PUBLIC_AVAILABILITY;
    items = items.map(item => ({
      ...item,
      quantity: (item.quantity || 0) > max_availavility ? max_availavility : item.quantity,
    }));

    return this.buildReturn({
      success: true,
      payload: {
        items: items,
        hasMore: false,
        cursor: null,
      }
    });
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
      color: this.table.color,
      colorHex: this.table.colorHex,
      productId: this.table.productId,

      name: products.name,
      description: products.description,
      price: products.price,
      isLabeled: products.isLabeled,
      labelContent: products.labelContent,
      labelColor: products.labelColor,
    };
  }

  async create(data: Record<string, any>) {
    return await super.create({
      ...data,
      color: typeof data.color === 'string' ? (data.color as string).toLowerCase() : data.color,
    });
  }

  async update(
    params: Record<string, any>,
    data: Record<string, any>
  ) {
    return await super.update(params, {
      ...data,
      color: typeof data.color === 'string' ? (data.color as string).toLowerCase() : data.color,
    });
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
    const conditions = super.buildQueryWhere(query, options);
    const { search, newArrivals, category, color, size, maxPrice, minPrice } = query;

    if (Array.isArray(query.ids) && query.ids.length > 0) {
      conditions.push(
        op.inArray(
          productsItems.id,
          query.ids,
        )
      );
    }

    if (typeof search === 'string' && search.length >= 3) {
      conditions.push(
        op.or(
          op.ilike(products.name, op.sql`'%' || ${search} || '%'`),
          op.ilike(products.description, op.sql`'%' || ${search} || '%'`),
          op.ilike(productsItems.color, op.sql`'%' || ${search} || '%'`),
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
      const decodedCategoryKey = base64url.decode(category);
      conditions.push(
        op.inArray(
          products.categoryId,
          op.sql`(
            SELECT id FROM ${categories} 
            WHERE ${categories.key} = ${decodedCategoryKey}
            OR ${categories.parentKey} = ${decodedCategoryKey}
          )`,
        )
      );
    }

    if (typeof color === 'string' && color) {
      const colorArr = color.split('|');
      conditions.push(
        op.inArray(
          op.sql`LOWER(TRIM(${productsItems.color}))`,
          colorArr.map(item => item.toLowerCase()),
        ),
      );
    }

    if (typeof size === 'string' && size) {
      const sizeArr = size.split('|');
      conditions.push(
        op.inArray(
          op.sql`LOWER(TRIM(${productsItems.size}))`,
          sizeArr.map(item => item.toLowerCase()),
        ),
      );
    }

    if (typeof minPrice === 'string' && minPrice) {
      conditions.push(
        op.gte(products.price, minPrice)
      );
    }

    if (typeof maxPrice === 'string' && maxPrice) {
      conditions.push(
        op.lte(products.price, maxPrice)
      );
    }

    return conditions;
  }

  protected buildCursorData (
    row: Record<string, any>,
    params: Record<string, any>
  ): Record<string, any> 
  {
    if (params.sortBy === 'trending') {
      return {
        id: row.id,
        updatedAt: row.updatedAt.toISOString(),
      };
    } else if (params.sortBy === 'latest-arrival') {
      return {
        id: row.id,
        createdAt: row.createdAt.toISOString(),
      };
    } else if (params.sortBy === 'price-low-high') {
      return {
        id: row.id,
        price: row.price,
      };
    } else if (params.sortBy === 'price-high-low') {
      return {
        id: row.id,
        price: row.price,
      };
    } else if (params.sortBy === 'relevance' || true) {
      return {
        id: row.id,
        updatedAt: row.updatedAt.toISOString(),
      }
    }
  }

  protected buildPaginationQueryWhere(
    params: Record<string, any>,
    options: BuildQueryOptions
  ): (op.SQL | undefined)[]
  {
    if (params.sortBy === 'trending') {
      const { cursorData: { updatedAt, id }} = params;
      return [
        op.or(
          op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt}) < ${updatedAt}`,
          op.and(
            op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt}) = ${updatedAt}`,
            op.sql`${this.table.id} >= ${id}`,
          ),
        )
      ];
    } else if (params.sortBy === 'latest-arrival') {
      const { cursorData: { createdAt, id }} = params;
      return [
        op.or(
          op.sql`DATE_TRUNC('milliseconds', ${this.table.createdAt}) < ${createdAt}`,
          op.and(
            op.sql`DATE_TRUNC('milliseconds', ${this.table.createdAt}) = ${createdAt}`,
            op.sql`${this.table.id} >= ${id}`,
          ),
        )
      ];
    } else if (params.sortBy === 'price-low-high') {
      const { cursorData: { price, id }} = params;
      return [
        op.or(
          op.sql`DATE_TRUNC('milliseconds', ${this.table.price}) > ${price}`,
          op.and(
            op.sql`DATE_TRUNC('milliseconds', ${this.table.price}) = ${price}`,
            op.sql`${this.table.id} >= ${id}`,
          ),
        )
      ];
    } else if (params.sortBy === 'price-high-low') {
      const { cursorData: { price, id }} = params;
      return [
        op.or(
          op.sql`DATE_TRUNC('milliseconds', ${this.table.price}) < ${price}`,
          op.and(
            op.sql`DATE_TRUNC('milliseconds', ${this.table.price}) = ${price}`,
            op.sql`${this.table.id} >= ${id}`,
          ),
        )
      ];
    } else if (params.sortBy === 'relevance' || true) {
      const { cursorData: { updatedAt, id }} = params;
      return [
        op.or(
          op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt}) < ${updatedAt}`,
          op.and(
            op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt}) = ${updatedAt}`,
            op.sql`${this.table.id} >= ${id}`,
          ),
        )
      ];
    }
  }

  protected buildPaginationQueryOrderBy(
    params: Record<string, any>,
    options: BuildQueryOptions
  ): op.SQL[]
  {
    const orderBy = super.buildPaginationQueryOrderBy(params, options);

    if (params.sortBy === 'trending') {
      return [
        op.desc(op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt})`),
        op.asc(this.table.id),
      ];
    } else if (params.sortBy === 'latest-arrival') {
      return [
        op.desc(op.sql`DATE_TRUNC('milliseconds', ${this.table.createdAt})`),
        op.asc(this.table.id),
      ];
    } else if (params.sortBy === 'price-low-high') {
      return [
        op.asc(products.price),
        op.asc(this.table.id),
      ];
    } else if (params.sortBy === 'price-high-low') {
      return [
        op.desc(products.price),
        op.asc(this.table.id),
      ];      
    } else if (params.sortBy === 'relevance' || true) {
      return [
        op.desc(op.sql`DATE_TRUNC('milliseconds', ${this.table.updatedAt})`),
        op.asc(this.table.id),
      ];
    }

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
