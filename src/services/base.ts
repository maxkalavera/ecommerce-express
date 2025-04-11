import { ModelService } from "@/types/services";
import { Accessor } from "@/types/accessors";
import { ID } from "@/types/db";

/**
 * Creates a base model service with standard CRUD operations.
 * The idea is to have a place to put all the common logic for a model.
 * 
 * @param accessor - Data accessor implementing basic CRUD operations
 * @returns ModelService object with create, read, update, and delete operations
 */

export function buildBaseModelService<
  Model extends { id?: number; key?: string; } = any,
>(
  accessor: Accessor<Model>
) {
  async function create(data: Model): Promise<Model> {
    return await accessor.create(data);
  }

  async function read(id: ID): Promise<Model | null> {
    return await accessor.read(id);
  }

  async function readAll(): Promise<Model[]> {
    return await accessor.readAll();
  }

  async function update(id: ID, data: Partial<Model>): Promise<Model | null> {
    return await accessor.update(id, data); 
  }

  async function remove(id: ID): Promise<boolean> {
    return await accessor.delete(id);
  }

  return {
    accessor: accessor,
    create,
    read,
    readAll,
    update,
    delete: remove,
  } as ModelService<Model>;
}