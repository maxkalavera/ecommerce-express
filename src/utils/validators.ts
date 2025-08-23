import Ajv, { Options, ErrorObject } from "ajv";
import base64url from 'base64url';
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

type ValidationReturned = {
    success: true,
    data: Record<string, any>
  } |
  {
    success: false,
    errors: Record<string, string[]>
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
): ValidationReturned
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
    return {
      success: true,
      data,
    };
  } else {
    return {
      success: false,
      errors: castTypeboxToErrorList(validate.errors || [])
    }
  }
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
): ValidationReturned 
{
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
  if (coherce(data)) {
    return {
      success: true,
      data: copiedData,
    };
  } else {
    return {
      success: false,
      errors: castTypeboxToErrorList(coherce.errors || [])
    }
  }
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

function castTypeboxToErrorList (errors: ErrorObject<string, Record<string, any>, unknown>[]) {
  const result: Record<string, string[]> = {};

  for (const error of errors) {
    let attr = '_';
    if (error.instancePath === '' && error.params!.additionalProperty) {
      attr = error.params!.additionalProperty;          
    } else if (error.instancePath !== ''){
      attr = error.instancePath.slice(1);
    }

    if (result[attr] === undefined) {
      result[attr] = [error.message || ""];
    } else {
      result[attr].push(error.message || "");
    }
  }

  return result;
}