import { NextFunction } from 'express';
import { buildTargetBaseController } from '@/controllers/base';
import { attachMixins, bindContext } from '@/utils/patterns';
import { Contextualized } from '@/types/patterns';

/*******************************************************************************
 * Controllers
 ******************************************************************************/


export function buildController<
  Target extends Contextualized,
> (
  target: Target,
) {
  /*
   * Target naming here is used instead of context, because the the final builded
   * controller will be the target context to attach to every method. So target 
   * objects are objects which methods's first argument is the context.
   */
  const targetBaseController = buildTargetBaseController();
  const fullTargetController = attachMixins(targetBaseController, target);
  const controller = bindContext(fullTargetController, fullTargetController);
  return controller;
}

/*******************************************************************************
 * CRUD Mixins
 ******************************************************************************/
/*
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
  view: [buildReadMixin, buildReadAllMixin],
  mutate: [buildCreateMixin, buildUpdateMixin, buildDeleteMixin],
  all: [buildCreateMixin, buildReadMixin, buildReadAllMixin, buildUpdateMixin, buildDeleteMixin]
} as const;
*/
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
