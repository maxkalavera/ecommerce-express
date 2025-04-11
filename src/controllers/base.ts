import { Controller } from "@/types/controllers";

export function buildBaseController(): Controller {
  const registerRoutes: Controller['registerRoutes'] = (router, path) => {
    console.log('Registering routes for', path);
  };

  return {
    registerRoutes
  };
}