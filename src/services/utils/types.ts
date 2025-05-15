import { ModelAccessor } from "@/accessors/utils/types";
import * as AccessorsTypes from "@/accessors/utils/types"
import { APIError } from "@/utils/errors";

/******************************************************************************
 * Accessor types
 *****************************************************************************/

export type ServiceStructure = {

};

export type AccessorServiceStructure = ServiceStructure & {
  accessor: ModelAccessor;
};

export type AccessorService = (
  & AccessorServiceStructure
  & CRUDService
);

export type CRUDService = (
  & CreateTarget
  & ReadTarget
  & ReadAllTarget
  & UpdateTarget
  & DeleteTarget
);

/******************************************************************************
 * Helper types
 *****************************************************************************/

export type ResultPayload<
  Result extends Record<string, any>,
> = AccessorsTypes.ResultPayload<Result>;

/******************************************************************************
 * CRUD types
 *****************************************************************************/
 
export type CreateTarget<
  Input extends Record<string, any> = Record<string, any>,
  Result extends Record<string, any> = Record<string, any>,
> = {
  commitCreate: AccessorsTypes.CreateTarget<Input, Result>["commitCreate"];
  create: AccessorsTypes.CreateTarget<Input, Result>["create"];
};

export type ReadTarget<
  Result extends Record<string, any> = Record<string, any>,
> = {  
  commitRead: AccessorsTypes.ReadTarget<Result>["commitRead"];
  read: AccessorsTypes.ReadTarget<Result>["read"];
};

export type ReadAllTarget<
  Input extends Record<string, any> = Record<string, any>,
  Result extends Record<string, any> = Record<string, any>,
> = {
  commitReadAll: AccessorsTypes.ReadAllTarget<Input, Result>["commitReadAll"];
  readAll: AccessorsTypes.ReadAllTarget<Input, Result>["readAll"];
};

export type UpdateTarget<
  Input extends Record<string, any> = Record<string, any>,
  Result extends Record<string, any> = Record<string, any>,
> = {
  commitUpdate: AccessorsTypes.UpdateTarget<Input, Result>["commitUpdate"];
  update: AccessorsTypes.UpdateTarget<Input, Result>["update"];
};

export type DeleteTarget<
  Result extends Record<string, any> = Record<string, any>,
> = {
  commitDelete: AccessorsTypes.DeleteTarget<Result>["commitDelete"];
  delete: AccessorsTypes.DeleteTarget<Result>["delete"];
};