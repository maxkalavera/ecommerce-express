import 'dotenv/config';
import http from "node:http";
import fs from "node:fs";
import express from 'express';
import settings from "@/settings";
import configureMiddlewares from "@/middlewares";
import routes from "@/routes";

/******************************************************************************
 * Initialization
 */

/******************************************************************************
 * Configuration
 */
// Create runtime folder if it doesn't exist
if (!fs.existsSync(settings.RUNTIME_FOLDER)) {
  fs.mkdirSync(settings.RUNTIME_FOLDER, { recursive: true });
}

if (settings.ENV === "development") {
  console.log("Running in development mode");
  console.log("Settings:", JSON.stringify(settings, null, 2));
}

const app = express();

configureMiddlewares(app);

app.use('/api', routes);

const server = http.createServer(app);

/******************************************************************************
 * Main function
 */

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

(async () => {
  server.listen(settings.PORT, () => {
    console.log(`Server is running on http://localhost:${settings.PORT}`);
  });
})();

process.on('SIGINT', onClose);
process.on('SIGTERM', onClose);
