import { buildAccessorService } from "@/services/utils/utils";
import { productsAccessor, productImagesAccessor, productItemsAccessor } from "@/accessors/products";
import { withCRUD } from "@/services/mixins/crud";

export const productsService = buildAccessorService({
  accessor: productsAccessor,
}).mutate(withCRUD);

export const productImagesService = buildAccessorService({
  accessor: productImagesAccessor,
}).mutate(withCRUD);

export const productItemsService = buildAccessorService({
  accessor: productItemsAccessor,
}).mutate(withCRUD);

