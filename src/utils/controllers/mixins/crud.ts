import { createMixin, CreateMixin as CreateMixinType } from "@/utils/controllers/mixins/crud/create";
import { readMixin, readAllMixin, ReadMixin as ReadMixinType, ReadAllMixin as ReadAllMixinType } from "@/utils/controllers/mixins/crud/read";
import { updateMixin, patchMixin, UpdateMixin as UpdateMixinType, PatchMixin as PatchMixinType } from "@/utils/controllers/mixins/crud/update";
import { deleteMixin, DeleteMixin as DeleteMixinType } from "@/utils/controllers/mixins/crud/delete";

export type CreateMixin = CreateMixinType;
export type ReadMixin = ReadMixinType;
export type ReadAllMixin = ReadAllMixinType;
export type UpdateMixin = UpdateMixinType;
export type PatchMixin = PatchMixinType;
export type DeleteMixin = DeleteMixinType;

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
