import { Static, Type } from '@sinclair/typebox';
import { ListCategoriesQueryParameters, CategoryInsert } from '@/typebox/categories';
import { categoriesAccessor } from '@/accessors/categories';
import { ServiceReturnType } from '@/types/services';

export const categoriesService = new (class {

  public async create(
    data: Static<typeof CategoryInsert>
  ): Promise<ServiceReturnType<any>>
  {
    return await categoriesAccessor.create(data);
  }

  public async read(identifier: { id: string }): Promise<ServiceReturnType<any>>
  {
    return await categoriesAccessor.read(identifier);
  }

  public async update(
    identifier: { id: string },
    data: Static<typeof CategoryInsert>
  ): Promise<ServiceReturnType<any>>
  {
    return await categoriesAccessor.update(identifier, data);
  }

  public async delete(
    identifier: { id: string }
  ): Promise<ServiceReturnType<any>>
  {
    return await categoriesAccessor.delete(identifier);
  }

  public async list(
    query: Static<typeof ListCategoriesQueryParameters>
  ): Promise<ServiceReturnType<any>>
  {
    return await categoriesAccessor.list(query);
  }

});