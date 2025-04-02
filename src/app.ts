import http from "node:http";
import express from 'express';
import settings from "@/settings";
import configureMiddlewares from "@/middlewares";

console.log("Settings", settings);

const app = express();

configureMiddlewares(app);

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const server = http.createServer(app);

/******************************************************************************
 * Main function
 */
(async () => {
  server.listen(settings.PORT, () => {
    console.log(`Server is running on http://localhost:${settings.PORT}`);
  });
})();
