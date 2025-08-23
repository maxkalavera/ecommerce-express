
import * as op from 'drizzle-orm';
import { Type } from '@sinclair/typebox';
import { BaseSchema } from '@/typebox/accessors/commons';
import { Nullable, Base64URL } from '@/utils/typebox';
import CoreAccessor, { type BuildQueryOptions } from '@/utils/accessors/CoreAccessor';
import { categories, categoriesImages } from '@/models/categories';
import { 
  //CategoriesInsert, 
  //CategoriesUpdate,
  //CategoriesQueryParams,
  CategoriesImagesInsert,
  CategoriesImagesUpdate,
} from '@/typebox/accessors/categories';
import { ImageAccessorComposer } from '@/utils/accessors/ImageAccessorComposer';


/*******************************************************************************
 * Categories
 ******************************************************************************/

class CategoriesAccessor extends CoreAccessor {

  constructor () {
    super(
      categories,
      {
        insertSchema: Type.Composite([
          BaseSchema,
          Type.Object({
            name: Type.String({ maxLength: 255 }),
            description: Type.String(),
            parentId: Type.Optional(Type.Integer()),
            parentKey: Type.Optional(Type.String({ format: 'base64url' })),
          })
        ], { additionalProperties: false }),

        updateSchema: Type.Partial(
          Type.Composite([
            BaseSchema,
            Type.Object({
              name: Type.String({ maxLength: 255 }),
              description: Type.String(),
              parentId: Type.Optional(Type.Integer()),
              parentKey: Type.Optional(Type.String({ format: 'base64url' })),
            })
          ], { additionalProperties: false })
        ),

        queryParamsSchema: Type.Object({
          childrenOf: Type.Optional(Base64URL()),
          ids: Type.Optional(Type.Array(Type.Integer())),
        }),
      }
    );
  }

  async create(
    data: Record<string, any>
  ) {
    let { parentId, parentKey } = data;
    if (parentKey && !parentId) {
      const payload = await this.read({ key: parentKey });
      if (!payload.isSuccess()) {
        throw this.buildError({
          sensitive: { message: `Parent with key: ${parentKey} could not get retrieved` }
        }, payload.getError());
      }
      const parent = payload.getPayload().data;
      parentId = parent.id;
    } else if (parentId && !parentKey) {
      const payload = await this.read({ id: parentId });
      if (!payload.isSuccess()) {
        throw this.buildError({
          sensitive: { message: `Parent with Id: ${parentId} could not get retrieved` }
        }, payload.getError());
      }
      const parent = payload.getPayload().data;
      parentKey = parent.key;
    }

    return await super.create({
      ...data,
      parentId, 
      parentKey,
    });
  }

  protected buildQuerySelectFields(): Record<string, any> {
    return {
      ...this.table,
      display: {
        ...categoriesImages,
      },
    };
  }

  protected buildQueryBaseSelect() {
    return this.db
     .select(this.buildQuerySelectFields())
     .from(this.table).leftJoin(
      categoriesImages, op.eq(categoriesImages.categoryId, this.table.id));
  }
  
  protected buildQueryWhere(
    params: Record<string, any>,
    options: BuildQueryOptions
  )
  {
    const filters = super.buildQueryWhere(params, options);

    if (params.childrenOf) {
      filters.push(op.eq(this.table.parentKey, params.childrenOf));
    }

    if (params.ids) {
      filters.push(op.inArray(this.table.id, params.ids));
    }

    return filters;
  }

};
export const categoriesAccessor = new CategoriesAccessor();


/*******************************************************************************
 * Categories's Images
 ******************************************************************************/

export class CategoriesImagesAccessor extends CoreAccessor {
  public images = new ImageAccessorComposer(this);

  constructor () {
    super(
      categoriesImages,
      {
        insertSchema: CategoriesImagesInsert,
        updateSchema: CategoriesImagesUpdate,
      }
    );
  }

};
export const categoriesImagesAccessor = new CategoriesImagesAccessor();