import { GenericObject } from "@/types/commons";

export type ValidateReturned<
  CleanedData extends GenericObject
> = {
  cleanedData: CleanedData;
  success: boolean;
};

export type CommitReturned<
  ResponsePayload extends GenericObject
> = {
  responsePayload: ResponsePayload;
  success: boolean;
};