import base64url from 'base64url';
import { getFiles, getFile } from '@/utils/seeds';
import { 
  productsAccessor, 
  productsItemsAccessor, 
  productsImagesAccessor 
} from "@/accessors/products";
import { categoriesAccessor } from "@/accessors/categories";
import productsJson from '@assets/fixtures/products.json' with { type: 'json' };
import productsItemsJson from '@assets/fixtures/products-items.json' with { type: 'json' };
import productsImagesJson from '@assets/fixtures/products-images.json' with { type: 'json' };

async function seedProductItem (
  productKey: string,
  productItemData: Record<string, any>,
) {
  const productItemPayload = await productsItemsAccessor.create({
    ...productItemData
  });
}

function getVariationsLength(data: Record<string, any>): number {
  let length: number | null = null;
  for (const value of Object.values(data)) {
    if (Array.isArray(value)) {
      return value.length;
    }
  }
  return 1;
}

function enrichData(items: Record<string, any>[]) {
  const data = [];
  for (const item of items) {
    const variationsLength = getVariationsLength(item);
    //const variations = [];
    let current: Record<string, any> = {}
    for (let i = 0; i < variationsLength; i++) {
      for (const [key, value] of Object.entries(item)) {
        if (Array.isArray(value)) {
          current[key] = value[i];
        } else {
          current[key] = value;
        }
      }
      data.push(current);
      current = {};
    }
  }
  return data;
}

export async function seedProducts(tx: any) {
  const productsItems = enrichData(productsItemsJson);

  for (const row of productsJson) {
    const { key: productKey, categoryKey, ...restRow } = row;

    const productReturned = await productsAccessor.create({
      ...restRow,
      key: base64url.encode(productKey),
      categoryKey: base64url.encode(categoryKey),
    });

    if (productReturned.isSuccess()) {
      const productPayload = productReturned.getPayload();
      // Seed items
      const relatedProductsItems = productsItems.filter((item) => item.productKey === productKey);
      for (const item of relatedProductsItems) {
        const { color, ...restItem } = item;
        await seedProductItem(productKey, {
          ...restItem,
          color: color[0],
          colorHex: color[1],
          productId: productPayload.data.id,
        });
      }

      const imagesData = productsImagesJson.filter((item) => item.productKey === productKey);
      for (const imageData of imagesData) {
        const { domain, key, isCover } = imageData;
        const image = await getFile(domain, key);
        await productsImagesAccessor.images.addImage(
          { 
            productId: productPayload.data.id,
            isCover
          }, 
          image,
        );
      }
    }
  }
}