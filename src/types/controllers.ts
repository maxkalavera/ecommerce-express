
import { NextFunction, Router } from 'express';

/*******************************************************************************
 * Controllers
 ******************************************************************************/

export type ControllerBase = {
  handleErrors: <
    Callback extends (...args: any) => any,
  > (
    callback: Callback, 
    next: NextFunction
  ) => (
    Promise<ReturnType<Callback>>
  );
  registerRoutes: (router: Router, path: string) => void;
};
