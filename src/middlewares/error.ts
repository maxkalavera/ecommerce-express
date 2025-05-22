import { Request, Response, NextFunction } from 'express';
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
  console.error(err);
  const acceptedTypes = req.accepts(['json', 'html', 'text']);
  const status = 500;
  const message = err.message || "Internal Server Error";

  if (acceptedTypes === 'json') {
    // Send a JSON response for APIs
    res.status(status).json({
      status,
      message: message,
      error: settings.ENV === 'development' ? err : undefined
    });
  } else if (acceptedTypes === 'html') {
    res.status(status).render('error', {
      status,
      message: message.slice(0, 100),
      error: err 
    });
  } else {
    res.status(status).send(message);
  }
};