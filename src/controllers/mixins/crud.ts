import { buildMixin } from "@/utils/patterns";
import all from "@/utils/controllers/mixins/crud";

export const createMixin = buildMixin({
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
} as typeof all.create, [all.create]);

export const readMixin = buildMixin({

} as typeof all.read, [all.read]);

export const readAllMixin = buildMixin({

} as typeof all.readAll, [all.readAll]);

export const updateMixin = buildMixin({

} as typeof all.update, [all.update]);

export const patchMixin = buildMixin({

} as typeof all.patch, [all.patch]);

export const deleteMixin = buildMixin({

} as typeof all.delete, [all.delete]);

export default {
  create: createMixin,
  read: readMixin,
  readAll: readAllMixin,
  update: updateMixin,
  patch: patchMixin,
  delete: deleteMixin,
  view: [readMixin, readAllMixin],
  mutate: [createMixin, updateMixin, patchMixin, deleteMixin],
  all: [readMixin, readAllMixin, createMixin, updateMixin, patchMixin, deleteMixin],
}