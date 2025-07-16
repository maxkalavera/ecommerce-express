import express, { Router } from 'express';
import { categoriesController } from '@/controllers/categories';
import { CartsItemsController } from '@/controllers/carts';
import { ProductsController } from '@/controllers/products';


const router: Router = express.Router();
console.info("Atacching routes to controllers...");

/******************************************************************************
 * Place all routes here.
 *****************************************************************************/

categoriesController.register(router);
ProductsController.register(router);
CartsItemsController.register(router);

/*****************************************************************************/
console.info("Routes attached.");

export default router;

