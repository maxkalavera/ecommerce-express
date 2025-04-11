import express, { Router } from 'express';
import { productsController } from '@/controllers/products';

const router: Router = express.Router();

productsController.registerRoutes(router, "/products");

export default router;

