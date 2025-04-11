import { Service, EntryModelService, ModelService } from "@/types/services";
import { Accessor } from "@/types/accessors";
import { ID } from "@/types/db";
import { buildBaseModelService } from "@/services/base";

/**
 * Builds a generic service with the minumun requirements for a service.
 * The service is wrapped in a proxy in case more control is needed.
 * The idea behind the service is to wrap a Middleware, to handle logic
 * necessary on every method call.
 * 
 * @param target - The target service to build the service from
 * @returns A proxied service that handles async method calls
 */

export function buildService (
  target: Service = {} as Service,
): Service
{
  const service = Object.assign({}, target);

  const proxyService = new Proxy(service, {
    get(target, prop, receiver) {
      if (typeof Reflect.get(target, prop, receiver) === "function") {
        const targetMethod = Reflect.get(target, prop, receiver) as ((...args: unknown[]) => unknown | Promise<unknown>);

        return async (...args: unknown[]) => {
          return await targetMethod(...args);
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  })

  return proxyService;
}

/**
 * Is a convinient function to build a service using a data accessor.
 * It builds a base model service using the accessor and then extends it
 * with the custom functionality provided in the target service.
 * The service is wrapped in a proxy in case more control is needed.
 * 
 * @param accessor - Data accessor for the model type
 * @param target - Optional target service to extend base functionality
 * @param buildBase - Function to build the base model service (defaults to buildBaseModelService)
 * @returns A proxied service combining base and custom functionality
 */

export function buildModelService<
  Model extends { id?: number; key?: string; } = any,
  TargetService extends EntryModelService<Model, ID> & { [key: string]: any } = any,
>(
  accessor: Accessor<Model>,
  target: EntryModelService<Model, ID> & TargetService = {} as TargetService,
  buildBase: typeof buildBaseModelService = buildBaseModelService
): ModelService<Model> & TargetService
{
  const base: ModelService<Model> = buildBase(accessor);
  const service = Object.assign({}, base, target);

  const proxyService = new Proxy(service, {
    get(target, prop, receiver) {
      if (typeof Reflect.get(target, prop, receiver) === "function") {
        const targetMethod = Reflect.get(target, prop, receiver) as ((...args: unknown[]) => unknown | Promise<unknown>);

        return async (...args: unknown[]) => {
          if (targetMethod.constructor.name === 'AsyncFunction') {
            if (Reflect.get(base, prop) !== undefined) {
              return await targetMethod(base,...args);
            }
            return await targetMethod(...args);
          }
          if (Reflect.get(base, prop) !== undefined) {
            return targetMethod(base,...args);
          }
          return await targetMethod(...args);
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  })

  return proxyService;
}
