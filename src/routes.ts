import express, { Router } from 'express';
import { categoriesRouter } from '@/controllers/categories';

const router: Router = express.Router();
console.info("Atacching routes to controllers...");

/******************************************************************************
 * Place all routes here.
 *****************************************************************************/

router.use('/categories', categoriesRouter);

/*****************************************************************************/
console.info("Routes attached.");

export default router;

