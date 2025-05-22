import { Router } from 'express';
import { productsAccessor } from '@/accessors/products';

export function registerProductsController(router: Router) {
  router.get('/products', async (req, res, next) => {
    const products = await productsAccessor.readAll();    
    res.json({
      data: products,
    });
  });
}