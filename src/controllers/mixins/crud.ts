import { 
  CreateMixin, ReadMixin, ReadAllMixin, UpdateMixin, PatchMixin, DeleteMixin 
} from "@/types/mixins/controllers/crud";

export const createMixin: CreateMixin = {
  validateCreate: async (data, next) => {},
  commitCreate: async (data, next) => {},
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
}