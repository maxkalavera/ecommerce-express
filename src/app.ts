import 'dotenv/config';
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import express from 'express';
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import * as OpenApiValidator from 'express-openapi-validator';
import settings from "@/settings";
import error from "@/middlewares/error";
import routes from "@/routes";
import SwaggerUi from 'swagger-ui-express';
import { openAPISchema } from '@/api-schema';
import { initializeExpressApp } from '@/utils/lifecycle';

/******************************************************************************
 * Constants
 *****************************************************************************/

// Build OpenAPI schema
const openAPIDocument = await openAPISchema.getDocument();

/******************************************************************************
 * Initialization
 *****************************************************************************/

const app = initializeExpressApp({
  beforeCreateApp: () => {
    // Create runtime files
    createRuntimeFolder();
    writeOpenAPIDocument(JSON.stringify(openAPIDocument, null, 2));

    if (settings.ENV === "development") {
      console.log("Running in development mode");
      console.log("Settings:", JSON.stringify(settings, null, 2));
    }
  },
  setAplicationLevelSettings: (app) => {
    // Set view engine
    app.set('views', path.resolve('src/assets/views'));
    app.set('view engine', 'ejs');
  },
  setBuiltInMiddlewares: (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  },
  setCustomMiddlewares: (app) => {
    app.use(morgan('dev'));
    app.use(helmet());
    app.use(cors());
  
    settings.ENV !== "production" && app.use(
      OpenApiValidator.middleware({
        apiSpec: openAPIDocument as any,
        validateRequests: true,
        validateResponses: true,
        ignoreUndocumented: true,
      }),
    );
  },
  setRoutes: (app) => {
    app.use('/api/', routes);
    app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(openAPIDocument));

  },
  setErrorMiddlewares: (app) => {
    app.use(error);  // Custom error handler
  }
});

const server = http.createServer(app);

/******************************************************************************
 * Process management
 *****************************************************************************/

const onClose = () => {
  console.log("Closing server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
  // Forcefully shut down after 10 seconds
  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
}
process.on('SIGINT', onClose);
process.on('SIGTERM', onClose);

/******************************************************************************
 * Start server
 *****************************************************************************/

(async () => {
  server.listen(settings.PORT, () => {
    console.log(`Server is running on http://localhost:${settings.PORT}`);
  });
})();



/******************************************************************************
 * Utils
 *****************************************************************************/

function createRuntimeFolder() {
  if (!fs.existsSync(settings.RUNTIME_FOLDER)) {
    fs.mkdirSync(settings.RUNTIME_FOLDER, { recursive: true });
  }
}

function writeOpenAPIDocument(openAPIDocument: string) {
  fs.writeFileSync(path.resolve(settings.RUNTIME_FOLDER, "openapi.json"), openAPIDocument);
}