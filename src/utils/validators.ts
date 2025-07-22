import Ajv, { Options } from "ajv";
import traverse from "traverse";
import lodash from "lodash";
import addFormats from "ajv-formats";
import { TSchema } from "@sinclair/typebox";
import { APIError } from "@/utils/errors";
import settings from '@/settings';


/******************************************************************************
 * Validator
 *****************************************************************************/

export function buildValidator(opts: Options) {
  const validator = addFormats(new Ajv(opts));

  validator.addFormat('base64url', {
    type: 'string',
    validate: (value) => /^[A-Za-z0-9_-]+$/.test(value),
  });

  validator.addFormat('decimal', {
    type: 'string',
    validate: (price) => {
      return /^\d+(\.\d{1,})?$/.test(price) || /^\d+(,\d{1,})?$/.test(price);
    }
  });

  return validator;
}


/******************************************************************************
 * Validation utils
 *****************************************************************************/

type ValidateOptions = { 
  additionalProperties: boolean | 'strict' | 'strict-dev-only'
};

type CoherceOptions = {
  additionalProperties: boolean | 'strict' | 'strict-dev-only'
};

const validator = buildValidator({
  allErrors: true,
  strict: true,
  strictSchema: true,
  strictTypes: true,
  strictRequired: true,
  removeAdditional: false,
  useDefaults: false,
  coerceTypes: false,
});


export function validate(
  schema: TSchema, 
  data: Record<string, any>,
  _options: Partial<ValidateOptions> = {}
): Record<string, any>
{
  const options: ValidateOptions = lodash.defaults(_options, {
    additionalProperties: true,
  } as ValidateOptions);

  if (
    options.additionalProperties === false
    || options.additionalProperties === 'strict'
    || ( options.additionalProperties === 'strict-dev-only' && settings.ENV === 'development')
  ) {
    schema = makeSchemaStrict(schema);
  }

  const validate = validator.compile(schema);
  if (validate(data)) {
    return data;
  }
  throw new APIError({ code: 400, message: 'Invalid data' })
    .addTypeboxValidationErrors(validate.errors);
}




/******************************************************************************
 * Cohersion utils
 *****************************************************************************/

const coercer = buildValidator({
  coerceTypes: true,
});

export function coherce(
  schema: TSchema, 
  data: Record<string, any>,
  _options: Partial<CoherceOptions> = {},
) {
  const options: CoherceOptions = lodash.defaults(_options, {
    additionalProperties: true,
  } as CoherceOptions);

  if (
    options.additionalProperties === false
    || options.additionalProperties === 'strict'
    || ( options.additionalProperties === 'strict-dev-only' && settings.ENV === 'development')
  ) {
    schema = makeSchemaStrict(schema);
  }

  const coherce = coercer.compile(schema);
  const copiedData = lodash.cloneDeep(data);
  if (coherce(copiedData)) {
    return copiedData;
  }
  throw new APIError({ code: 400, message: 'Invalid data' })
    .addTypeboxValidationErrors(coherce.errors);
}


/******************************************************************************
 * Utils
 *****************************************************************************/

function makeSchemaStrict(schema: TSchema) {
  const clonedSchema = lodash.cloneDeep(schema);
  // Remove patternProperties attr in objects to be able tu use additionalProperties keyword
  // and set additionalProperties to false
  traverse(clonedSchema).forEach(function (value) {
    if (typeof value === 'object' && value.type === 'object' && value.additionalProperties === false) {
      this.update({
        ...value,
        patternProperties: undefined,
        additionalProperties: false,
      });
    }
  });
  return clonedSchema;
}