import { Request, Response, NextFunction } from 'express';
import settings from "@/settings";

/******************************************************************************
 * Custom errors handler
 */

export default (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error(err.stack); // Log the error stack trace

  // Send a JSON response for APIs
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: settings.ENV === 'development' ? err.stack : undefined
  });
};