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

export type APIErrorSensitivePayalod = {
  message: string;
  details: Record<string, string[]>;
  timestamp: Date;
  stack: any;
};

export type APIErrorSensitiveParameters = {
  message: string;
  details: Record<string, string[]>;
};

/******************************************************************************
 * Errors
 *****************************************************************************/

export class APIError extends Error {
  protected publicPayload: APIErrorPublicPayload | null = null;
  protected sensitivePayload: APIErrorSensitivePayalod | null = null;
  public publicPayloadStack: APIErrorPublicPayload[] = [];
  private sensitivePayloadStack: APIErrorSensitivePayalod[] = [];

  /*
  public message: string;
  public details: Record<string, string[]>;
  public code: number;
  public timestamp: Date;
  public errorStack: (Error | Record<string, any> | string)[] = [];
  */

  constructor (
    _params: Partial<{
      public: Partial<APIErrorPublicPayload>,
      sensitive: Partial<APIErrorSensitiveParameters>
    }> = {},
    error: Error | unknown = new Error(),
  ) {
    super();

    if (typeof _params.public === 'object') {
      this.publicPayload = lodash.defaults(_params.public, {
        message: "",
        details: {},
        code: 500,
        timestamp: new Date(),
      } as APIErrorPublicPayload);
      this.publicPayloadStack = [ this.publicPayload  ];
    }
    
    if (typeof _params.sensitive === 'object') {
      this.sensitivePayload = lodash.defaults(typeof _params.sensitive, {
        message: "",
        details: {},
        timestamp: new Date(),
        stack: undefined,
      });
      this.sensitivePayloadStack = [ this.sensitivePayload ];
    }

    if (error instanceof APIError) {
      this.publicPayloadStack = [
        ...this.publicPayloadStack,
        ...error.publicPayloadStack,
      ];
      this.sensitivePayloadStack = [
        ...this.sensitivePayloadStack,
        ...error.sensitivePayloadStack,
      ];
    } else if (error instanceof Error) { 
      this.sensitivePayloadStack = [
        ...this.sensitivePayloadStack,
        {
          message: error.message,
          stack: error.stack,
          details: {},
          timestamp: new Date(),
        }
      ];
    }
  }



  /*
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
      //lodash.merge(this.details, details);
    } else {
      lodash.merge(this.sensitivePayload.details, details);
    }

    return this;
  }
  */

  public toPublicObject() {
    return this.publicPayloadStack[this.publicPayloadStack.length - 1] || {
      message: "Internal Server Error",
      details: {},
      code: 500,
      timestamp: new Date(),
    }; 
  }

  public toSensitiveObject() {
    return lodash.clone(this.sensitivePayloadStack);
  }

  public toObject (mode: 'public' | 'sensitive') {
    if (mode === 'public') {
      return this.publicPayloadStack[this.publicPayloadStack.length - 1] || {
        message: "Internal Server Error",
        details: {},
        code: 500,
        timestamp: new Date(),
      }; 
    } else {
      return lodash.clone(this.sensitivePayloadStack);
    }
  }
}


/*
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
*/