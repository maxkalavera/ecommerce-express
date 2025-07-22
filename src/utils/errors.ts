import http from "node:http";
import { ErrorObject } from "ajv";
import { ValidateFunction } from "ajv";
import lodash from 'lodash';

/******************************************************************************
 * Types
 *****************************************************************************/

export type APIErrorParameters = {
  message: string;
  details?: Record<string, string[]>;
  code?: number;
  errorStack?: (Error | Record<string, any>)[];
}

/******************************************************************************
 * Errors
 *****************************************************************************/

const APIErrorParamsDefaults: Required<APIErrorParameters> = {
  message: "Internal server error",
  details: {},
  code: 500,
  errorStack: [],
}

export class APIError extends Error {
  public message: string;
  public details: Record<string, string[]>;
  public statusCode: number;
  public timestamp: Date;
  public errorStack: (Error | Record<string, any>)[];

  static fromError (
    error: Error | unknown, 
    params: Omit<APIErrorParameters, "errorStack">
  ) {
    if (error instanceof APIError) {
      return new APIError({ 
        ...error,
        ...params
      });
    } else if (error instanceof Error) {
      return new APIError({ 
        ...params,
        errorStack: [
          {
            message: error.message,
            stack: error.stack
          }
        ]
      });
    }
    throw new Error (`Error parameter should be of error type: ${error}`);
  }

  constructor (
    _params: APIErrorParameters
  ) {
    super();
    const params = lodash.defaultsDeep(_params, APIErrorParamsDefaults) as Required<APIErrorParameters>;

    this.statusCode = params.code;
    this.name = http.STATUS_CODES[params.code] || "Unknown Error";
    this.message = params.message;
    this.details = params.details;
    this.timestamp = new Date();
    this.errorStack = [...params.errorStack];
  }

  public addTypeboxValidationErrors (errors: ValidateFunction<any>['errors']) {
    if (errors) {
      errors.forEach((error) => {
        let attr = '_';
        if (error.instancePath === '' && error.params!.additionalProperty) {
          attr = error.params!.additionalProperty;          
        } else if (error.instancePath !== ''){
          attr = error.instancePath.slice(1);
        }

        if (this.details[attr] === undefined) {
          this.details[attr] = [error.message || ""];
        } else {
          this.details[attr].push(error.message || "");
        }
      })
    }
    return this;
  }

  public toResponseObject () {
    return {
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
    };
  }

  public toHTMLContext () {
    return {
      statusCode: this.statusCode,
      message: this.message.slice(0, 100),
      details: JSON.stringify(this.details, null, 2),
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }

  public toLoggerText () {
    return JSON.stringify({ 
      statusCode: this.statusCode, 
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    }, null, 2);
  }
}

export class AccessorError extends Error {
  public message: string;
  private field: string;
  private value: any;

  constructor (message: string, field: string = "_", value: any = null) {
    super();
    this.name = 'APIError';
    this.message = message;
    this.field = field;
    this.value = value;
  }

  public static fromAjvError (error: ErrorObject): AccessorError {
    return new AccessorError(
      error.message || "", 
      error.propertyName || "", 
      error.data
    );
  }
  public static fromAjvErrors(errors: ErrorObject[]): AccessorError[] {
    return errors.map((error) => AccessorError.fromAjvError(error));
  }
}