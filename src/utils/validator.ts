import Ajv from "ajv";
import lodash from "lodash";
import addFormats from "ajv-formats";
import { TSchema } from "@sinclair/typebox";
import { APIError } from "@/utils/errors";

/******************************************************************************
 * Validator
 *****************************************************************************/

export const validator = addFormats(new Ajv({
  allErrors: true,
  coerceTypes: true,
}));

validator.addFormat('base64url', {
  type: 'string',
  validate: (value) => /^[A-Za-z0-9_-]+$/.test(value),
});


/******************************************************************************
 * Util valdation functions
 *****************************************************************************/

export function validate(
  schema: TSchema, 
  data: Record<string, any>,
): Record<string, any>
{
  const validate = validator.compile(schema);
  const copiedData = lodash.cloneDeep(data);
  if (validate(copiedData)) {
    return copiedData;
  }
  throw new APIError({ code: 400, message: 'Invalid data' })
    .addTypeboxValidationErrors(validate.errors)
}

export function parseQueryRows (
  schema: TSchema, 
  data: Record<string, any>[],
  mapper: (row: Record<string, any>) => Record<string, any> = (row) => row,
): Record<string, any>[]
{
  const copy = lodash.cloneDeep(data).map(mapper);
  const validate = validator.compile(schema);
  const parsedData = new Array(copy.length);
  for (let i = 0; i < copy.length; i++) {
    if (validate(copy[i])) {
      parsedData[i] = copy[i];
    } else {
      throw new APIError({ code: 400, message: "Invalid data structure" })
        .addTypeboxValidationErrors(validate.errors);
    }
  }
  return parsedData;
}

export default validator;