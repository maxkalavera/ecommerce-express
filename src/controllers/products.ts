import { productsAccessor } from '@/accessors/products';

export function registerProductsController(router: any) {
  router.get('/products', async (req: any, res: any) => {

    const products = await productsAccessor.readAll();
    
    res.json({
      data: products,
    });
  });
}