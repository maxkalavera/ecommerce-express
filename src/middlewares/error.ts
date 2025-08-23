import util from 'node:util';
import { Request, Response, NextFunction } from 'express';
import { APIError } from '@/utils/errors';
import settings from "@/settings";

/******************************************************************************
 * Custom errors handler
 */

export default function error (
  err: Error, 
  req: Request, 
  res: Response,
  next: NextFunction
): void 
{
  const apiError = err !instanceof APIError ? err : new APIError({ 
    public: { message: 'Internal server error', code: 500 }, 
    sensitive: { message: err.message }
  }, err);

  console.log(util.inspect(apiError.toSensitiveObject(), {
    showHidden: false, // show non-enumerable properties
    depth: null, // recurse indefinitely
    colors: true, // ANSI color output
    compact: false, // break into multiple lines
    maxArrayLength: null, // show all array items
    breakLength: Infinity, // don't break long lines
    sorted: true // sort object keys alphabetically
  }));
  
  if (res.headersSent) {
    next();
  } else {
    const apiErrorResponse = apiError.toPublicObject();
    res.status(apiErrorResponse.code).json(apiErrorResponse);
    next();
  }
};