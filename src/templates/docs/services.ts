// @ts-nocheck

import { OpenAPICRUDBuilder } from '@/utils/docs/OpenAPICRUDBuilder';
import * as ___Schemas from '@/typebox/services/___';


export const ___Docs = new OpenAPICRUDBuilder('___')
  .setDefaultSuccessItemSchema(___Schemas.___)
  .addCreateOperation({
    requestBodySchema: ___Schemas.___Insert,
  })
  .addUpdateOperation({
    requestBodySchema: ___Schemas.___Update,
  })
  .addDeleteOperation()
  .addGetOperation()
  .addListOperation({
    parameters: [],
  })
  .buildDocument();
