import { NextFunction } from 'express';
import { Controller, ControllerBuilder, ControllerMixin, CRUDMixinBuilder, CRUDMixinBuilderEnum, EntryControler, ReadMixin } from "@/types/controllers";
import { CreateMixin } from '@/types/controllers';
import { buildBaseController } from './base';

/*******************************************************************************
 * CRUD Mixins
 ******************************************************************************/

export const buildCreateMixin: CRUDMixinBuilderEnum["create"] = () => {
  const validateCreate: CreateMixin['validateCreate'] = async (
    data, next
  ) => {}
  const commitCreate: CreateMixin['commitCreate'] = async (
    data, next
  ) => {}
  const create: CreateMixin['create'] = async (
    req,
    res,
    next
  ) => {
    try {
      const data = await validateCreate(req.body, next);
      if (data !== undefined) {
        const instance = await commitCreate(data, next);
        if (instance !== undefined) {
          return res.status(201).json(instance);
        } else {
          return res.status(400).json({ error: 'Bad Request' });
        }
      } else {
        return res.status(400).json({ error: 'Bad Request' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return {
    validateCreate,
    commitCreate,
    create,
  } as CreateMixin;
}

export const buildReadMixin: CRUDMixinBuilderEnum["read"] = () => {
  return {
    read: async (req, res, next) => {
      return res.status(201).json({ message: "hello world" });
    }
  };
};

export const CRUDMixins = {
  create: buildCreateMixin,
  read: buildReadMixin,
} as const;

/*******************************************************************************
 * Controllers
 ******************************************************************************/

/**
 * Builds a generic controller with the minumun requirements for a controller.
 * The controller is wrapped in a proxy in case more control is needed.
 * The idea behind the controller is to wrap a Middleware, to handle logic
 * necessary on every method call.
 * 
 * @param target - The target controller to build the controller from
 * @returns A proxied controller that handles async method calls
 */

export function buildController<
  Mixins extends [...CRUDMixinBuilder[]] = []
> (
  target: EntryControler = {} as EntryControler,
  mixins: Mixins = [] as unknown as Mixins,
): (
  typeof mixins extends never[] ? Controller : Controller & ReturnType<Mixins[number]>
) {
  const base = buildBaseController();
  const mixinInstances = mixins.map(mixin => mixin());
  const controller = Object.assign({}, base, target, ...mixinInstances);

  const proxyController = new Proxy(controller, {
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

  return proxyController;
}

/*******************************************************************************
 * Utils
 ******************************************************************************/

export function handleErrors<
  ReturnType = unknown,
  Callback extends () => void | ReturnType = () => void | ReturnType
>(
  callback: Callback, 
  next: NextFunction
): void | ReturnType {
  try {
    return callback();
  } catch (error) {
    next(error);
  }
}