import express, { Router } from 'express';
import { categoriesController } from '@/controllers/categories';
import { cartsItemsController } from '@/controllers/carts';
import { productsController, favoritesProductsController } from '@/controllers/products';


const router: Router = express.Router();
console.info("Atacching routes to controllers...");

/******************************************************************************
 * Place all routes here.
 *****************************************************************************/

categoriesController.register(router);
productsController.register(router);
cartsItemsController.register(router);
favoritesProductsController.register(router);

/*****************************************************************************/
console.info("Routes attached.");

export default router;

