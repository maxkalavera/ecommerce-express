import { categories, categoriesImages } from "@/models/categories";
import base64url from 'base64url';
import { resetSerialSequence } from "@/seeds/utils";

const categoriesData = [
  /*
   * Keys will be recorded as UUID4 in the database but automatically be parsed to base64url 
   * format when retrieved to the client to facilitate url querying in the API.
   */
  // key in base64url: MDc2ZjdlYzctNzEyZi00OTIzLTk3YzgtYmIxM2E5ZWUzZTk5
  { id: 1, key: "076f7ec7-712f-4923-97c8-bb13a9ee3e99", name: "Men", description: "Clothes for men", parentId: null, parentKey: null },
  // Key in base64url: ODljOGNlZDEtNzU5Ny00ZjVlLTgzMWUtM2E4MDlhM2NjMmVl
  { id: 2, key: "89c8ced1-7597-4f5e-831e-3a809a3cc2ee", name: "Women", description: "Clothes for women", parentId: null, parentKey: null },
  // Men's subcategories
  { id: 3, key: "5fa1c211-a189-42a9-81c5-d35382578857", name: "Pants", description: "", parentId: 1, parentKey: "076f7ec7-712f-4923-97c8-bb13a9ee3e99" },
  { id: 4, key: "1e4aad25-7c34-496c-b9fc-7e08896c7713", name: "Suits and Blazers", description: "", parentId: 1, parentKey: "076f7ec7-712f-4923-97c8-bb13a9ee3e99" },
  { id: 5, key: "6b142ad2-84bd-4333-87b1-0418bf55d22d", name: "Jackets and Coats", description: "", parentId: 1, parentKey: "076f7ec7-712f-4923-97c8-bb13a9ee3e99" },
  { id: 6, key: "364c21c7-4b81-4c9e-acdb-ec6815f63ed5", name: "Shorts", description: "", parentId: 1, parentKey: "076f7ec7-712f-4923-97c8-bb13a9ee3e99" },
  { id: 7, key: "95b9174d-cea2-41b7-85e3-77ac8d823e32", name: "Activewear", description: "", parentId: 1, parentKey: "076f7ec7-712f-4923-97c8-bb13a9ee3e99" },
  { id: 8, key: "0bc6879e-46eb-4e11-bcda-a9c9d890e580", name: "Innerwear and Undergarments", description: "", parentId: 1, parentKey: "076f7ec7-712f-4923-97c8-bb13a9ee3e99" },
  { id: 9, key: "90237cc9-d86f-44e8-8987-5462b899f86d", name: "Accessories", description: "", parentId: 1, parentKey: "076f7ec7-712f-4923-97c8-bb13a9ee3e99" },
  // Women's subcategories
  { id: 10, key: "c6a5a103-98c9-43f2-9c4e-fb78f53e58b4", name: "Tops", description: "", parentId: 2, parentKey: "89c8ced1-7597-4f5e-831e-3a809a3cc2ee"},
  { id: 11, key: "b4886eb5-795a-419b-bd4b-f8bb991ef5ce", name: "Dresses", description: "", parentId: 2, parentKey: "89c8ced1-7597-4f5e-831e-3a809a3cc2ee"},
  { id: 12, key: "fefe0a5f-6c8f-4b21-b67c-8211707c64b4", name: "Bottoms", description: "", parentId: 2, parentKey: "89c8ced1-7597-4f5e-831e-3a809a3cc2ee"},
  { id: 13, key: "26b7c1ef-da06-4020-b863-d87321ee3ed0", name: "Activewear", description: "", parentId: 2, parentKey: "89c8ced1-7597-4f5e-831e-3a809a3cc2ee" },
  { id: 14, key: "0a8eee07-ad10-4153-bf1c-06faee43d3f2", name: "Jackets and Coats", description: "", parentId: 2, parentKey: "89c8ced1-7597-4f5e-831e-3a809a3cc2ee"},
  { id: 15, key: "8033453a-4981-444d-8ef7-7fe9d02518ef", name: "Innerwear and Lingerie", description: "", parentId: 2, parentKey: "89c8ced1-7597-4f5e-831e-3a809a3cc2ee"},
  { id: 16, key: "fb98299b-34f6-4520-bd13-488c5015cf0a", name: "Nightwear", description: "", parentId: 2, parentKey: "89c8ced1-7597-4f5e-831e-3a809a3cc2ee" },
  { id: 17, key: "e8ba64b6-893f-4010-a964-89df911e8113", name: "Maternity Wear", description: "", parentId: 2, parentKey: "89c8ced1-7597-4f5e-831e-3a809a3cc2ee"},
  { id: 18, key: "2e8b9b42-1154-42b8-925b-5cedde09a8cf", name: "Accessories", description: "", parentId: 2, parentKey: "89c8ced1-7597-4f5e-831e-3a809a3cc2ee"},
];

export async function seedCategories(db: any) {
  // Convert UUID4 keys to base64url format
  const insertCategoriesData = categoriesData.map(row => ({
    ...row,
    key: base64url.encode(row.key),
    parentKey: row.parentKey ? base64url.encode(row.parentKey) : null,
  }));
  await db.insert(categories).values(insertCategoriesData);
  await resetSerialSequence(db, categories, categories.id);
}

const categoriesImagesData = [
  { id: 1, key: "f600b77b-6f92-4fc0-89e2-65a5e058c713", categoriesId: 1, name: "", mimetype: "image/jpeg" },
  { id: 2, key: "dfe5104d-c4b4-4757-a2bd-e97bc277f10f", categoriesId: 2, name: "", mimetype: "image/jpeg" },
  { id: 3, key: "4d55fbe7-b813-4516-bdf0-9a0c847209b5", categoriesId: 3, name: "", mimetype: "image/jpeg" },
  { id: 4, key: "1066529a-5978-451f-90e5-9bd47ea47c0f", categoriesId: 4, name: "", mimetype: "image/jpeg" },
  { id: 5, key: "33cc2835-2519-4612-8db2-ba3c8797d91b", categoriesId: 5, name: "", mimetype: "image/jpeg" },
  { id: 6, key: "c60bca44-6d33-4fd9-9fa1-94383b7ef146", categoriesId: 6, name: "", mimetype: "image/jpeg" },
  { id: 7, key: "55ce1931-6d0a-4124-86b7-ce9054b6c156", categoriesId: 7, name: "", mimetype: "image/jpeg" },
  { id: 8, key: "23bba489-59f3-4986-bb47-1f46935f2435", categoriesId: 8, name: "", mimetype: "image/jpeg" },
  { id: 9, key: "f70c8172-9324-410b-8a5a-a01feda4151b", categoriesId: 9, name: "", mimetype: "image/jpeg" },
  { id: 10, key: "5b76749b-80bc-450b-9e7a-0dd0916ab21c", categoriesId: 10, name: "", mimetype: "image/jpeg" },
  { id: 11, key: "9fed35b2-a2dc-4fb7-9d63-d0d06d78bb62", categoriesId: 11, name: "", mimetype: "image/jpeg" },
  { id: 12, key: "20cf5831-d3ef-4929-a1c8-ea85d8bf2bf1", categoriesId: 12, name: "", mimetype: "image/jpeg" },
  { id: 13, key: "aef260f1-aff9-4ce3-b745-0a90307bd51d", categoriesId: 13, name: "", mimetype: "image/jpeg" },
  { id: 14, key: "bdd28327-19cb-40b9-8400-5d59661692b5", categoriesId: 14, name: "", mimetype: "image/jpeg" },
  { id: 15, key: "0830c693-df1a-4711-ae60-e9cc67c535fc", categoriesId: 15, name: "", mimetype: "image/jpeg" },
  { id: 16, key: "53ad2aa7-f6eb-4291-bd1f-28c1165f36b5", categoriesId: 16, name: "", mimetype: "image/jpeg" },
  { id: 17, key: "24a1ee67-769a-4547-85c7-6426074effce", categoriesId: 17, name: "", mimetype: "image/jpeg" },
  { id: 18, key: "ba82adbb-e85d-4f8f-b9bf-5c9487f399c7", categoriesId: 18, name: "", mimetype: "image/jpeg" },
];

export async function seedCategoriesImages(db: any) {
  // Convert UUID4 keys to base64url format
  const insertCategoriesImagesData = categoriesImagesData.map(row => ({
    ...row,
    key: base64url.encode(row.key),
  }));
  await db.insert(categoriesImages).values(seedCategoriesImages);
  await resetSerialSequence(db, categoriesImages, categoriesImages.id);
}
