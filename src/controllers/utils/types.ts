

import { Service } from "@/services/utils/types";

/******************************************************************************
 * Accessor types
 *****************************************************************************/

export type CRUDOperations = 
  | "create"
  | "read"
  | "readAll"
  | "update"
  | "delete"
  | "view"
  | "mutate"
  | "full";

export type Controller = {
  [key: string]: any;
};

export type ServiceController = Controller & {
  service: Service;
};

/******************************************************************************
 * Helper types
 *****************************************************************************/

