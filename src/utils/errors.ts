import { ValueError, ValueErrorIterator } from "@sinclair/typebox/build/cjs/errors";

/******************************************************************************
 * Errors
 *****************************************************************************/

export class APIError extends Error {
  public field: string;

  constructor (message: string, field: string = "_") {
    super();
    this.name = 'APIError';
    this.message = message;
    this.field = field;
  }

  public static fromTypeBoxError (error: ValueError): APIError {
    return new APIError(error.message, error.path);
  }
  public static fromTypeBoxErrors (errors: ValueError[] | ValueErrorIterator): APIError[] {
    if (Array.isArray(errors)) {
      return errors.map((error) => new APIError(error.message, error.path));
    } else {
      return this.fromTypeBoxErrors(Array.from(errors));
    }
  }
}