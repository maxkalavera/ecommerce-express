import Ajv from "ajv";
import lodash from "lodash";
import addFormats from "ajv-formats";
import { TSchema } from "@sinclair/typebox";
import { APIError } from "@/utils/errors";

export const validator = addFormats(new Ajv({
  allErrors: true,
  coerceTypes: true,
}));

export function validate(
  schema: TSchema, 
  data: Record<string, any>,
  errorMessage: string = 'Invalid data'
): { success: true, data: Record<string, any> } | { success: false, error: APIError }
{
  const validate = validator.compile(schema);
  if (validate(data)) {
    return { success: true, data };
  }
  return {
    success: false,
    error: new APIError(400, errorMessage)
      .addTypeboxValidationErrors(validate.errors),
  };
}

export function parseQueryRows (
  schema: TSchema, 
  data: Record<string, any>[],
  mapper: (row: Record<string, any>) => Record<string, any> = (row) => row,
  errorMessage: string = 'Invalid data structure',
): { success: true, data: Record<string, any>[] } | { success: false, error: APIError } 
{
  const copy = lodash.cloneDeep(data).map(mapper);
  const validate = validator.compile(schema);
  const parsedData = new Array(copy.length);
  for (let i = 0; i < copy.length; i++) {
    if (validate(copy[i])) {
      parsedData[i] = copy[i];
    } else {
      return {
        success: false,
        error: new APIError(400, errorMessage)
         .addTypeboxValidationErrors(validate.errors),
      };
    }
  }
  return { success: true, data: parsedData };
}

export default validator;