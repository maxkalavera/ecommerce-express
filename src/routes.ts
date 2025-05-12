import express, { Router } from 'express';
import { productsController } from '@/controllers/products';

console.info("Atacching routes to controllers...");

const router: Router = express.Router();

productsController.registerRoutes(router, "/products");

console.info("Routes attached!", router.stack);

export default router;

