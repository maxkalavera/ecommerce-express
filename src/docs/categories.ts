import { OpenAPICRUDBuilder } from '@/utils/docs/APIDocsCRUDBuilder';

export const categoriesDocs = new OpenAPICRUDBuilder('categories')
  .addCreateOperation()
  .addUpdateOperation()
  .addDeleteOperation()
  .addGetOperation()
  .addListOperation()
  .buildDocument();
