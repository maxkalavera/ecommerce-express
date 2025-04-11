import { buildController, CRUDMixins } from "@/controllers/commons";

export const productsController = buildController({}, [
  CRUDMixins.create,
]);

type test = Parameters<typeof buildController>;