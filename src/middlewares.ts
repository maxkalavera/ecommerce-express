import express, { Express } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import error from "@/middlewares/error";

export default function configureMiddlewares(app: Express) {
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Custom error handler
  app.use(error);
}