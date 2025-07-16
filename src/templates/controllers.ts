// @ts-nocheck

import { CRUDController } from '@/utils/controllers/CRUDController';
import { ___Service } from '@/services/___';


export const ___Controller = new CRUDController(
  '___', 
  {
    executers: {
      create: async (requestData, { buildReturn }) => {
        return await ___Service.create(requestData);
      },
      update: async (requestData, { buildReturn }) => {
        return await ___Service.update(requestData);
      },
      delete: async (requestData, { buildReturn }) => {
        return await ___Service.delete(requestData);
      },
      read: async (requestData, { buildReturn }) => {
        return await ___Service.create(requestData);
      },
      list: async (requestData, { buildReturn }) => {
        return await ___Service.list(requestData);
      }
    }
  }
);

