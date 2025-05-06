import { productsModel, productImagesModel, productItemsModel } from "@/models/products";
import { categoriesModel } from "@/models/categories";

export default { 
  products: productsModel.table,
  productImages: productImagesModel.table,
  productItems: productItemsModel.table,
  categories: categoriesModel.table,
};
