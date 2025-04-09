import { EntryService, Service } from "@/types/services";
import { Accessor } from "@/types/accessors";
import { ID } from "@/types/db";

export function buildService<
  Model extends { id?: number; key?: string; } = any,
  TargetService extends EntryService<Model, ID> & { [key: string]: any } = any,
>(
  accessor: Accessor<Model>,
  target: EntryService<Model, ID> & TargetService = {} as TargetService
): Service<Model> & TargetService
{
  const base: Service<Model> = {
    accessor: accessor,
    async create(data: Model): Promise<Model> {
      return await accessor.create(data);
    },
    async read(id: ID): Promise<Model | null> {
      return await accessor.read(id);
    },
    async readAll(): Promise<Model[]> {
      return await accessor.readAll();
    },
    async update(id: ID, data: Partial<Model>): Promise<Model | null> {
      return await accessor.update(id, data); 
    },
    async delete(id: ID): Promise<boolean> {
      return await accessor.delete(id);
    }
  };

  const service = Object.assign({}, base, target);

  const proxyService = new Proxy(service, {
    get(target, prop, receiver) {
      if (typeof Reflect.get(target, prop, receiver) === "function") {
        const targetMethod = Reflect.get(target, prop, receiver) as ((...args: unknown[]) => unknown | Promise<unknown>);

        return async (...args: unknown[]) => {
          if (target.middleware) {
            return await target.middleware(targetMethod, args);
          }

          if (targetMethod.constructor.name === 'AsyncFunction') {
            if (Reflect.get(base, prop) !== undefined) {
              return await targetMethod(base,...args);
            }
            return await targetMethod(...args);
          }
          if (Reflect.get(base, prop) !== undefined) {
            return targetMethod(base,...args);
          }
          return targetMethod(...args);
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  })

  return proxyService;
}
