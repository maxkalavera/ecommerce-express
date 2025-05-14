import settings from "@/settings";
import { Router, Application, Request } from "express";
import { ServiceController, CRUDOperations } from "@/controllers/utils/types";

/******************************************************************************
 * Types
 *****************************************************************************/

export type CRUDController = {
  getLookUpAttribute: () => string;
  getParametersData: (req: Request) => Record<string, any>;
  create: Application;
  read: Application;
  readAll: Application;
  update: Application;
  delete: Application;
  registerCreate: (router: Router, path: string, handler: Application) => void;
  registerRead: (router: Router, path: string, handler: Application) => void;
  registerReadAll: (router: Router, path: string, handler: Application) => void;
  registerUpdate: (router: Router, path: string, handler: Application) => void;
  registerDelete: (router: Router, path: string, handler: Application) => void;
  registerRoutes: (router: Router, path: string, methods?: CRUDOperations[]) 
    => void;
}

/******************************************************************************
 * Mutators
 *****************************************************************************/

export function withCRUD <
  Source extends ServiceController
> (
  source: Source
) {
  return {
    ...source,
    getLookUpAttribute () {
      return settings.QUERIES_LOOK_UP_ATTRIBUTE;
    },
    getParametersData (req) {
      const data = {...req.body,...req.params, requery: req.query.params };
      return data;
    },
    async create (req, res, next) {
      const data = this.getParametersData(req);
      const result = await this.service.create(data);
      return res.json(result);
    },
    async read (req, res, next) {
      const data = this.getParametersData(req);
      const result = await this.service.read(data);
      return res.json(result); 
    },
    async readAll (req, res, next) {
      const data = this.getParametersData(req);
      const result = await this.service.readAll(data);
      return res.json(result);
    },
    async update (req, res, next) {
      const data = this.getParametersData(req);
      const result = await this.service.update(data);
      return res.json(result);
    },
    async delete (req, res, next) {
      const data = this.getParametersData(req);
      const result = await this.service.delete(data);
      return res.json(result);
    },
    registerCreate (router, path, handler) {
      if (typeof this.create !== "function") {
        throw new Error("create method not defined");
      }
      router.post(path, handler);
    },
    registerRead (router, path, handler) {
      if (typeof this.read!== "function") {
        throw new Error("read method not defined");
      }
      router.get(joinUrlPaths(path, `:${this.getLookUpAttribute()}`), handler);
    },
    registerReadAll (router, path, handler) {
      if (typeof this.readAll!== "function") {
        throw new Error("readAll method not defined");
      }
      router.get(joinUrlPaths(path), handler);
    },
    registerUpdate (router, path, handler) {
      if (typeof this.update!== "function") {
        throw new Error("update method not defined");
      }
      router.put(joinUrlPaths(path, `:${this.getLookUpAttribute()}`), handler);
    },
    registerDelete (router, path, handler) {
      if (typeof this.delete!== "function") {
        throw new Error("delete method not defined");
      }
      router.delete(joinUrlPaths(path, `:${this.getLookUpAttribute()}`), handler);
    },
    registerRoutes (router, path, methods=["full"]) {
      if (methods.includes("create") || methods.includes("mutate") || methods.includes("full")) {
        this.registerCreate(router, path, this.create.bind(this));
      }
      if (methods.includes("read") || methods.includes("view") || methods.includes("full")) {
        this.registerRead(router, path, this.read.bind(this));
      }
      if (methods.includes("readAll") || methods.includes("view") || methods.includes("full")) {
        this.registerReadAll(router, path, this.readAll.bind(this));
      }
      if (methods.includes("update") || methods.includes("mutate") || methods.includes("full")) {
        this.registerUpdate(router, path, this.update.bind(this));
      }
      if (methods.includes("delete") || methods.includes("mutate") || methods.includes("full")) {
        this.registerDelete(router, path, this.delete.bind(this));
      }
    }
  } as Source & CRUDController;
}

/******************************************************************************
 * Utils
 *****************************************************************************/

/**
 * Safely joins URL path segments, handling duplicate slashes and ensuring proper formatting
 * @param paths - Array of path segments to join
 * @returns Properly formatted URL path
 */
function joinUrlPaths(...paths: string[]): string {
  return paths
    .map(path => path.trim())
    .map(path => path.replace(/^\/+|\/+$/g, '')) // Remove leading/trailing slashes
    .filter(path => path.length > 0) // Remove empty segments
    .join('/')
    .replace(/\/+/g, '/') // Replace multiple consecutive slashes with single slash
    .replace(/^(?!\/)/, '/'); // Ensure path starts with forward slash
};
