import { productsModel, productImagesModel, productItemsModel } from "@/models/products";


export default { 
  products: productsModel.table,
  productImages: productImagesModel.table,
  productItems: productItemsModel.table 
};
