import 'dotenv/config';
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import express from 'express';
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from 'compression';
import settings from "@/settings";
import error from "@/middlewares/error";
import routes from "@/routes";
import SwaggerUi from 'swagger-ui-express';
import { initializeExpressApp } from '@/utils/lifecycle';
import { specs } from '@/openapi';

/******************************************************************************
 * Initialization
 *****************************************************************************/

const app = initializeExpressApp({
  beforeCreateApp: () => {
    // Create runtime files
    createRuntimeFolder();

    if (settings.ENV === "development") {
      console.log("Running in development mode");
      console.log("Settings:", JSON.stringify(settings, null, 2));
    }
  },
  setAplicationLevelSettings: (app) => {
    // Set view engine
    app.set('views', path.resolve('assets/views'));
    app.set('view engine', 'ejs');
  },
  setBuiltInMiddlewares: (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(compression());
    app.use(
      settings.MEDIA_URL_PREFIX, 
      express.static(settings.MEDIA_STORAGE_FOLDER, {
        maxAge: '1y', // Cache for 1 year (CDN-friendly)
        setHeaders: (res) => {
          res.set('Cross-Origin-Resource-Policy', 'same-site'); // Prevent hotlinking
          res.set('Cache-Control', 'public, max-age=86400');    // Cache for 1 day
        }
      })
    );
  },
  setCustomMiddlewares: (app) => {
    app.use(morgan('dev'));
    app.use(helmet());
    app.use(cors());
  },
  setRoutes: (app) => {
    app.use('/api/', routes);
    app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(specs));
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

if (
  Buffer.from(settings.SECRET_KEY, "hex").length < 32
) {
  console.error("SECRET_KEY has to be set in environment variables (.env)");
  console.error("SECRET_KEY has to be at least 32 characters long");
  console.error("SECRET_KEY has to be a hex string");
  process.exit(1);
}


(async () => {
  server.listen(settings.PORT, () => {
    console.log(`Server is running on http://localhost:${settings.PORT}`);
  });
})();



/******************************************************************************
 * Utils
 *****************************************************************************/

function createRuntimeFolder() {
  console.log("Settings", settings);
  if (!fs.existsSync(settings.RUNTIME_FOLDER)) {
    fs.mkdirSync(settings.RUNTIME_FOLDER, { recursive: true });
  }
}
