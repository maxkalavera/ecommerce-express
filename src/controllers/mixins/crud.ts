import { GenericObject } from "@/types/commons";
import { 
  CreateMixin, ReadMixin, ReadAllMixin, UpdateMixin, PatchMixin, DeleteMixin 
} from "@/types/mixins/controllers/crud";

export const createMixin: CreateMixin = {
  validateCreate: async (target, data, next) => {
    target.handleErrors(() => {

    }, next);
  },
  commitCreate: async (target, data, next) => {
    target.handleErrors(() => {

    }, next);
  },
  create: async (
    target, req, res, next
  ) => {
    try {
      const data = await target.validateCreate(req.body, next);
      if (data !== undefined) {
        const instance = await target.commitCreate(data, next);
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
};

export const readMixin: ReadMixin = {
  commitRead: async (target, data) => {
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
    return { instances: {} } as GenericObject;
  },
  readAll: async (target, req, res, next) => {
    const instances = await target.commitReadAll(req.body, next);
    return res.status(200).json(instances);
  }
};

export const updateMixin: UpdateMixin = {
  validateUpdate: async (target, data, next) => {},
  commitUpdate: async (target, data, next) => {},
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
  validatePatch: async (target, data, next) => {},
  commitPatch: async (target, data, next) => {},
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
  validateDelete: async (target, data, next) => {

  },
  commitDelete: async (target, data, next) => {
    return { success: true }; 
  },
  delete: async (target, req, res, next) => {
    try {
      const success = await target.commitDelete(req.params, next);
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