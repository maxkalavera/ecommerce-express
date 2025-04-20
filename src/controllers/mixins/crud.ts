import { GenericObject } from "@/types/commons";
import { ControllerBase, ControllerMixin, ValidateControllerMixin } from "@/types/controllers";
import { 
  CreateMixin, ReadMixin, ReadAllMixin, UpdateMixin, PatchMixin, DeleteMixin 
} from "@/types/mixins/controllers/crud";
import { WithoutContext } from "@/types/patterns";

export const createMixin: CreateMixin = {
  validateCreate: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        cleanedData: {},
        success: true
      };
    }, next);
  },
  commitCreate: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  create: async (
    target, req, res, next
  ) => {
    try {
      const validated = await target.validateCreate(req.body, next);
      if (validated.success) {
        const commited = await target.commitCreate(validated.cleanedData, next);
        if (commited.success) {
          return res.status(201).json(commited.responsePayload);
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
};

export const readMixin: ReadMixin = {
  lookUpAttribute: "id",
  commitRead: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  read: async (target, req, res, next) => {
    try {
      const instance = await target.commitRead(req.params, next);
      if (instance) {
        return res.status(200).json(instance);
      } else {
        return res.status(404).json({ error: 'Not Found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const readAllMixin: ReadAllMixin = {
  commitReadAll: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  readAll: async (target, req, res, next) => {
    const instances = await target.commitReadAll(req.body, next);
    return res.status(200).json(instances);
  }
};

export const updateMixin: UpdateMixin = {
  lookUpAttribute: "id",
  validateUpdate: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        cleanedData: {},
        success: true
      };
    }, next);
  },
  commitUpdate: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  update: async (target, req, res, next) => {
    try {
      const data = await target.validateUpdate(req.body, next);
      if (data !== undefined) {
        const instance = await target.commitUpdate(data, next);
        if (instance !== undefined) {
          return res.status(200).json(instance);
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
};

export const patchMixin: PatchMixin = {
  lookUpAttribute: "id",
  validatePatch: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        cleanedData: {},
        success: true
      };
    }, next);
  },
  commitPatch: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  patch: async (target, req, res, next) => {
    try {
      const data = await target.validatePatch(req.body, next);
      if (data !== undefined) {
        const instance = await target.commitPatch(data, next);
        if (instance !== undefined) {
          return res.status(200).json(instance);
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
};

export const deleteMixin: DeleteMixin = {
  lookUpAttribute: "id",
  commitDelete: async (target, data, next) => {
    return target.handleErrors(() => {
      return {
        responsePayload: {},
        success: true
      };
    }, next);
  },
  delete: async (target, req, res, next) => {
    try {
      const { success } = await target.commitDelete(req.params, next);
      if (success) {
        return res.status(204).send();
      } else {
        return res.status(404).json({ error: 'Not Found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const view = [readMixin, readAllMixin]
export const mutate = [createMixin, updateMixin, patchMixin, deleteMixin];
export const all = [...view, ...mutate];


type A = {
  foo: (a: number, b: string) => string;
} & {
  foo: () => number;
}
