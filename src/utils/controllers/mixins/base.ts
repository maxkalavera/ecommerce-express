import { ControllerBase } from "@/types/controllers";
import { buildMixin } from "@/utils/patterns";

export const controllersBaseMixin = buildMixin<
  ControllerBase,
  []
> ({
  handleErrors: (target, callback, next) => {
    try {
      return callback();
    } catch (error) {
      next(error);
    }
  },
  registerRoutes: (target, router, path) => {
    if (target.create) {
      router.post(joinUrlPaths(path), target.create);
    }
    if (target.read) {
      router.get(
        joinUrlPaths(path, `:${target.lookUpAttribute}`), 
        target.read
      );
    }
    if (target.readAll) {
      router.get(joinUrlPaths(path), target.readAll);
    }
    if (target.update) {
      router.put(
        joinUrlPaths(path, `:${target.lookUpAttribute}`), 
        target.update
      );
    }
    if (target.patch) {
      router.put(
        joinUrlPaths(path, `:${target.lookUpAttribute}`), 
        target.patch
      );
    }
    if (target.delete) {
      router.delete(
        joinUrlPaths(path, `:${target.lookUpAttribute}`),
        target.delete
      );
    }

    console.log('Registering routes for', path);
    console.log('Target:', target);
    console.log('Router:', router);
    console.log('Path:', path);
  }
});

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
