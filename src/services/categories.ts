import { Static, Type } from '@sinclair/typebox';
import { ListCategoriesQueryParameters, CategoryInsert } from '@/typebox/categories';
import { categoriesAccessor } from '@/accessors/categories';
import { ServiceReturnType } from './utils/types';

export const categoriesService = new (class {
  public async create(
    data: Static<typeof CategoryInsert>
  ): Promise<ServiceReturnType<any>>
  {
    const result = await categoriesAccessor.create(data);

    return result;
  }

  public async list(
    query: Static<typeof ListCategoriesQueryParameters>
  ): Promise<ServiceReturnType<any>>
  {
    const { cursor, limit, childrenOf } = query;

    const result = await categoriesAccessor.list({
      cursor,
      limit,
      childrenOf,
    });

    return result;
  }

});