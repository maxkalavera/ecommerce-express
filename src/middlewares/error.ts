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
  console.log(util.inspect(err, {
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
    const apiError = err !instanceof APIError ? err : new APIError({}, err);
    const acceptedTypes = req.accepts(['json', 'html']);

    if (acceptedTypes === 'html') {
      res.status(apiError.code).render('error', apiError.toHTMLContext('public'));
    } else {
      res.status(apiError.code).json(apiError.toObject('public'));
    }
    next();
  }
};