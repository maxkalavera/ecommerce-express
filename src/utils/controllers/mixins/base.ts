import { ControllerBase } from "@/types/controllers";
import { buildMixin } from "@/utils/patterns";

export const controllersBaseMixin = buildMixin<
  ControllerBase,
  []
> ({
  basePath: "/",
  handleErrors: (target, callback, next) => {
    try {
      return callback();
    } catch (error) {
      next(error);
    }
  },
  registerRoutes: (target, router, path) => {
    if (target.create) {
      router.post(joinUrlPaths(target.basePath, path), target.create);
    }
    if (target.read) {
      router.get(
        joinUrlPaths(target.basePath, path, `:${target.lookUpAttribute}`), 
        target.read
      );
    }
    if (target.readAll) {
      router.get(joinUrlPaths(target.basePath, path), target.readAll);
    }
    if (target.update) {
      router.put(
        joinUrlPaths(target.basePath, path, `:${target.lookUpAttribute}`), 
        target.update
      );
    }
    if (target.patch) {
      router.put(
        joinUrlPaths(target.basePath, path, `:${target.lookUpAttribute}`), 
        target.patch
      );
    }
    if (target.delete) {
      router.delete(
        joinUrlPaths(target.basePath, path, `:${target.lookUpAttribute}`),
        target.delete
      );
    }
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
