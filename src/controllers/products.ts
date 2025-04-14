import { buildController, CRUDMixins } from "@/controllers/commons";

export const productsController = buildController({}, [
  ...CRUDMixins.all,
]);


productsController.create(null as any, null as any, null as any);