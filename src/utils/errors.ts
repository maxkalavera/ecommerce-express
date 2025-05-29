import http from "node:http";
import { ErrorObject } from "ajv";
import { ValidateFunction } from "ajv";

/******************************************************************************
 * Errors
 *****************************************************************************/

export class APIError extends Error {
  public message: string;
  public details: Record<string, string[]>;
  public statusCode: number;
  public timestamp: Date;

  static fromError (error: Error) {
    if (error instanceof APIError) {
      return error;
    }
    console.error(error);
    return new APIError(500, "Internal server error");
  }

  constructor (statusCode: number, message: string, details: Record<string, string[]> = {}) {
    super();
    this.statusCode = statusCode;
    this.name = http.STATUS_CODES[statusCode] || "Unknown Error";
    this.message = message;
    this.details = details;
    this.timestamp = new Date();
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