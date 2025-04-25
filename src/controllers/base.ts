import { buildMixin } from "@/utils/patterns";
import { controllersBaseMixin as baseMixin } from "@/utils/controllers/mixins/base";

/******************************************************************************
 * Types
 *****************************************************************************/

type ControllersBaseMixin = {};

/******************************************************************************
 * Main
 *****************************************************************************/

export const controllersBaseMixin = buildMixin<
  ControllersBaseMixin,
  [typeof baseMixin]
> ({

}, [baseMixin]);

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
}
