import express, { Router } from 'express';
import { registerProductsController } from '@/controllers/products';

const router: Router = express.Router();
console.info("Atacching routes to controllers...");

/******************************************************************************
 * Place all routes here.
 *****************************************************************************/

registerProductsController(router);

/*****************************************************************************/
console.info("Routes attached.");

export default router;

