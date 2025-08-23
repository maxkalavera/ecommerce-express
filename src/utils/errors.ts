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

  constructor (
    _params: {
      public?: Partial<APIErrorPublicPayload>,
      sensitive: Partial<APIErrorSensitiveParameters> & {
        message: string;
      }
    },
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
      this.sensitivePayload = lodash.defaults(_params.sensitive, {
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

  public toPublicObject() {
    return this.publicPayloadStack[this.publicPayloadStack.length - 1] || {
      message: "Internal Server Error",
      details: {},
      code: 500,
      timestamp: new Date(),
    }; 
  }

  public toSensitiveObject() {
    return lodash.clone([
      {
        message: this.message,
        stack: this.stack && this.stack.split('\n'),
        details: {},
        timestamp: new Date(),
      },
      ...this.sensitivePayloadStack.map((item) => ({
        message: item.message,
        details: item.details,
        stack: item.stack && item.stack.split('\n'),
        timestamp: item.timestamp,
      }))
    ]);
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
