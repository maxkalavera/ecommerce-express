import http from "node:http";
import { ErrorObject } from "ajv";
import { ValidateFunction } from "ajv";
import lodash from 'lodash';

/******************************************************************************
 * Types
 *****************************************************************************/

export type APIErrorPublicPayload = {
  message: string;
  details: Record<string, string[]>;
  code: number;
  timestamp: Date;
};


export type APIErrorSensitiveParameters = {
  message: string;
  details: Record<string, string[]>;
  //timestamp: Date;
};

/*
export type APIErrorParameters = {
  message?: string;
  details?: Record<string, string[]>;
  code?: number;
  timestamp?: Date;
}
*/

/******************************************************************************
 * Errors
 *****************************************************************************/

/*
const APIErrorParamsDefaults: Required<APIErrorParameters> = {
  message: "",
  details: {},
  code: 500,
  timestamp: new Date(),
}
*/

export class APIError extends Error {
  public publicPayload: APIErrorPublicPayload;

  public message: string;
  public details: Record<string, string[]>;
  public code: number;
  public timestamp: Date;
  public errorStack: (Error | Record<string, any> | string)[] = [];
  //protected privatePayload: APIErrorPrivatePayload;


  /*
  public message: string;
  public details: Record<string, string[]>;
  public statusCode: number;
  public timestamp: Date;
  public errorStack: (Error | Record<string, any> | string)[] = [];
  */

  constructor (
    publicPayload: Partial<APIErrorPublicPayload> = {},
    _sensitive: Partial<APIErrorSensitiveParameters> = {},
    error: Error | unknown = new Error(),
  ) {
    super();

    this.publicPayload = lodash.defaults(publicPayload, {
      message: "",
      details: {},
      code: 500,
      timestamp: new Date(),
    } as APIErrorPublicPayload);
    
    const sensitive = lodash.defaults(_sensitive, {
      message: "",
      details: {},
    });

    this.message = sensitive.message;
    this.details = lodash.merge(sensitive.details, this.publicPayload.details);
    this.code = this.publicPayload.code;
    this.timestamp = this.publicPayload.timestamp;

    if (error instanceof APIError) {
      this.errorStack = [
        error.toObject('sensitive'),
        ...error.errorStack
      ];
    } else if (error instanceof Error) {
      this.message = error.message ? error.message : this.message;
      this.errorStack = [{
        name: error.name,
        message: error.message,
        stack: error.stack,
      }];
    }

  }

  public addTypeboxValidationErrors (
    errors: ValidateFunction<any>['errors'], 
    mode: 'public' | 'sensitive'
  ) {
    const details: Record<string, string[]> = {};

    if (errors) {
      for (const error of errors) {
        let attr = '_';
        if (error.instancePath === '' && error.params!.additionalProperty) {
          attr = error.params!.additionalProperty;          
        } else if (error.instancePath !== ''){
          attr = error.instancePath.slice(1);
        }

        if (details[attr] === undefined) {
          details[attr] = [error.message || ""];
        } else {
          details[attr].push(error.message || "");
        }
      }
    }

    if (mode === 'public') {
      lodash.merge(this.publicPayload.details, details);
      lodash.merge(this.details, details);
    } else {
      lodash.merge(this.details, details);
    }

    return this;
  }

  public toObject (mode: 'public' | 'sensitive') {
    if (mode === 'public') {
      return this.publicPayload;
    } else {
      return {
        name: this.name,
        stack: this.stack,
        message: this.message,

      };
    }
  }

  public toHTMLContext (mode: 'public' | 'sensitive') {
    if (mode === 'public') {
      return {
        code: this.publicPayload.code,
        message: this.publicPayload.message.slice(0, 100),
        details: JSON.stringify(this.publicPayload.details, null, 2),
        timestamp: this.publicPayload.timestamp,
        stack: [],
      };
    } else {
      return {
        code: this.code,
        message: this.message.slice(0, 100),
        details: JSON.stringify(this.details, null, 2),
        timestamp: this.timestamp,
        stack: this.stack,
      };
    }


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