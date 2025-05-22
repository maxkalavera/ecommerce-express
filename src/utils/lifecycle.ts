import express from "express";

export type InitializationLifecycleObject = {
  beforeCreateApp(): void;
  afterCreateApp(app: express.Express): void;
  setAplicationLevelSettings(app: express.Express): void;
  setBuiltInMiddlewares(app: express.Express): void;
  setCustomMiddlewares(app: express.Express): void;
  setRoutes(app: express.Express): void;
  setFallbackMiddlewares(app: express.Express): void;
  setErrorMiddlewares(app: express.Express): void;
};

export function initializeExpressApp (
  _lifecycle: Partial<InitializationLifecycleObject> = {}
) {
  const lifecycle: InitializationLifecycleObject = {
    beforeCreateApp: () => {},
    afterCreateApp: () => {},
    setAplicationLevelSettings: () => {},
    setBuiltInMiddlewares: () => {},
    setCustomMiddlewares: () => {},
    setRoutes: () => {},
    setFallbackMiddlewares: () => {},
    setErrorMiddlewares: () => {},
    ..._lifecycle,
  };

  lifecycle.beforeCreateApp();
  const app = express();
  lifecycle.afterCreateApp(app);
  lifecycle.setAplicationLevelSettings(app);
  lifecycle.setBuiltInMiddlewares(app);
  lifecycle.setCustomMiddlewares(app);
  lifecycle.setRoutes(app);
  lifecycle.setFallbackMiddlewares(app);
  lifecycle.setErrorMiddlewares(app);

  return app;
}