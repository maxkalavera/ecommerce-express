import { NextFunction } from 'express';
import { Controller, CRUDMixinBuilder, CRUDMixinBuilderEnum, EntryController } from "@/types/controllers";
import { CreateMixin } from '@/types/controllers';
import { buildBaseController } from '@/controllers/base';
import { WithoutTarget } from '@/types/commons';

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

export const buildReadAllMixin: CRUDMixinBuilderEnum["readAll"] = () => {
  return {
    readAll: async (req, res, next) => {
      return res.status(201).json({ message: "hello world" });
    }
  };
};

export const buildUpdateMixin: CRUDMixinBuilderEnum["update"] = () => {
  return {
    validateUpdate: async (
      data, next
    ) => {},
    commitUpdate: async (
      data, next
    ) => {},
    update: async (req, res, next) => {
      return res.status(201).json({ message: "hello world" });
    },
  }
};

export const patchMixin: CRUDMixinBuilderEnum["patch"] = () => {
  return {
    validatePatch: async (
      data, next
    ) => {},
    commitPatch: async (
      data, next
    ) => {},
    patch: async (req, res, next) => {
      return res.status(201).json({ message: "hello world" });
    }
  }
};

export const buildDeleteMixin: CRUDMixinBuilderEnum["delete"] = () => {
  return {
    delete: async (req, res, next) => {
      return res.status(201).json({ message: "hello world" });
    }
  } 
};

export const CRUDMixins = {
  create: buildCreateMixin,
  read: buildReadMixin,
  readAll: buildReadAllMixin,
  update: buildUpdateMixin,
  delete: buildDeleteMixin,
  all: [
    buildCreateMixin,
    buildReadMixin,
    buildReadAllMixin,
    buildUpdateMixin,
    buildDeleteMixin,
  ]
} as const;

/*******************************************************************************
 * Controllers
 ******************************************************************************/

/*
function withTarget(
  target: EntryBaseController,
): BaseController {
  return Object.entries(target).reduce((wrappedController, [key, value]) => {
    if (typeof value === 'function') {
      const func = value as (...args: unknown[]) => unknown | Promise<unknown>;
      wrappedController[key] = async (...args: unknown[]) => {
        //return await func.apply(target, args);
        return await func(target, ...args);
      };
    } else {
      wrappedController[key] = value;
    }
    return wrappedController;
  }, target) as unknown as BaseController;
}
*/


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
  Mixins extends [...CRUDMixinBuilder[]] = [],
> (
  target: EntryController = {} as EntryController,
  mixins: Mixins = [] as unknown as Mixins,
): (
  typeof mixins extends never[] ? Controller : Controller & ReturnType<Mixins[number]>
) {
  const source = attachTarget(buildBaseController());
  const mixinInstances = mixins.map(mixin => mixin());
  const controller: typeof mixins extends never[] ? Controller : Controller & ReturnType<Mixins[number]> = 
    Object.assign(source, target, ...mixinInstances);

  return controller;
  /*
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
  });

  return proxyController;
  */
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

/******************************************************************************
 * Utils
 */

/**
 * Wraps a target controller with method binding to ensure proper 'this' context
 * 
 * Takes an EntryBaseController and returns a new BaseController where all methods
 * are bound to the target controller instance. This ensures methods maintain their
 * proper 'this' context when called.
 * 
 * @param target - The controller instance to wrap
 * @returns A new BaseController with bound methods
 * 
 * @example
 * const controller = withTarget({
 *   async getData() {
 *     return this.someValue;
 *   }
 * });
 */

function attachTarget<
  Source extends { [key: string]: any },
>(
  source: Source,
): WithoutTarget<Source> {
  return Object.entries(source).reduce((wrappedController, [key, value]) => {
    if (typeof value === 'function') {
      const func = value as (...args: unknown[]) => unknown | Promise<unknown>;
      if (func.constructor.name === 'AsyncFunction') {
        (wrappedController as any)[key] = async (...args: unknown[]) => {
          return await func(source, ...args);
        };
      } else {
        (wrappedController as any)[key] = (...args: unknown[]) => {
          return func(source,...args);
        };
      }
    } else {
      (wrappedController as any)[key] = value;
    }
    return wrappedController;
  }, source);
}