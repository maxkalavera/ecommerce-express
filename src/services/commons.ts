import { EntryService, Service } from "@/types/services";
import { Accessor } from "@/types/accessors";

export function buildService<
  Model extends { id?: number; key?: string; },
  ID=number,
  AditionalServices=unknown
>(
  accessor: Accessor<Model, ID>,
  target: EntryService<Model, ID> & AditionalServices
): Service<Model, ID> & AditionalServices
{

  const base: Service<Model, ID> = {
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
          if (targetMethod.constructor.name === 'AsyncFunction') {
            return await targetMethod(base, ...args);
          }
          return targetMethod(base, ...args);
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  })

  return proxyService;
}


