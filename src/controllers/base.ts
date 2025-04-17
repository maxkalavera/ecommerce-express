import { 
  ControllerBaseMixin, 
} from "@/types/controllers";
import { 
  CreateMixin, 
  ReadMixin, 
  ReadAllMixin,
  UpdateMixin,
  DeleteMixin,
} from "@/types/mixins/controllers/crud";

export const controllerBaseMixin: ControllerBaseMixin = {
  handleErrors: (target, callback, next) => {
    try {
      return callback();
    } catch (error) {
      next(error);
    }
  },
  registerRoutes: (target, router, path) => {
    if (target.create) {
      router.post(joinUrlPaths(path), target.create as CreateMixin['create']);
    }
    if (target.read) {
      router.get(joinUrlPaths(path, ':id'), target.read as ReadMixin['read']);
    }
    if (target.readAll) {
      router.get(joinUrlPaths(path), target.readAll as ReadAllMixin['readAll']);
    }
    if (target.update) {
      router.put(joinUrlPaths(path, ':id'), target.update as UpdateMixin['update']);
    }
    if (target.delete) {
      router.delete(joinUrlPaths(path, ':id'), target.delete as DeleteMixin['delete']);
    }

    console.log('Registering routes for', path);
    console.log('Target:', target);
    console.log('Router:', router);
    console.log('Path:', path);
  }
}

/*
export function buildTargetBaseController (): TargetBaseController {
  const registerRoutes: TargetBaseController['registerRoutes'] = (target, router, path) => {

    if (target.create) {
      router.post(joinUrlPaths(path), target.create as CreateMixin['create']);
    }
    if (target.read) {
      router.get(joinUrlPaths(path, ':id'), target.read as ReadMixin['read']);
    }
    if (target.readAll) {
      router.get(joinUrlPaths(path), target.readAll as ReadAllMixin['readAll']);
    }
    if (target.update) {
      router.put(joinUrlPaths(path, ':id'), target.update as UpdateMixin['update']);
    }
    if (target.delete) {
      router.delete(joinUrlPaths(path, ':id'), target.delete as DeleteMixin['delete']);
    }

    console.log('Registering routes for', path);
    console.log('Target:', target);
    console.log('Router:', router);
    console.log('Path:', path);
  };

  return {
    registerRoutes
  };
};

/*
export function buildBaseController(): BaseControllerEntry {

  const registerRoutes: BaseControllerEntry['registerRoutes'] = (target, router, path) => {
    if (target.create) {
      router.post(joinUrlPaths(path), target.create as CreateMixin['create']);
    }
    if (target.read) {
      router.get(joinUrlPaths(path, ':id'), target.read as ReadMixin['read']);
    }
    if (target.readAll) {
      router.get(joinUrlPaths(path), target.readAll as ReadAllMixin['readAll']);
    }
    if (target.update) {
      router.put(joinUrlPaths(path, ':id'), target.update as UpdateMixin['update']);
    }
    if (target.delete) {
      router.delete(joinUrlPaths(path, ':id'), target.delete as DeleteMixin['delete']);
    }

    console.log('Registering routes for', path);
    console.log('Target:', target);
    console.log('Router:', router);
    console.log('Path:', path);
  };

  return {
    registerRoutes
  };
}
*/


/******************************************************************************
 * Utils
 */

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
}
