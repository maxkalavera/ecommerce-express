import express, { Router } from 'express';
import { productsController } from '@/controllers/products';

console.info("Atacching routes to controllers...");

const router: Router = express.Router();
productsController.registerRoutes(router, "/products");

export default router;

