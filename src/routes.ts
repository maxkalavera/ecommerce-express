import express, { Router } from 'express';
import { productsController } from '@/controllers/products';
import { categoriesController } from '@/controllers/categories';

const router: Router = express.Router();
console.info("Atacching routes to controllers...");
/******************************************************************************
 * Place all routes here.
 *****************************************************************************/

productsController.registerRoutes(router, "/products");
categoriesController.registerRoutes(router, "/categories");

/*****************************************************************************/
console.info("Routes attached.");

export default router;

