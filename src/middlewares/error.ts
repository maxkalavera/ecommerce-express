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
  const apiError = err !instanceof APIError ? err : APIError.fromError(err, { message: 'Internal server error' });
  const acceptedTypes = req.accepts(['json', 'html']);

  //console.log("----------------------------------------------------------------------");
  //console.error(apiError.toLoggerText());

  if (acceptedTypes === 'html') {
    res.status(apiError.statusCode).render('error', apiError.toHTMLContext());
  } else {
    res.status(apiError.statusCode).json(apiError.toResponseObject());
  }
};