/**
 * Audio Path Resolver
 * Handles dynamic path resolution for both localhost and public URLs
 */

let cachedBasePath: string | null = null;

/**
 * Get the base path for the application
 * Works with both relative paths and different deployment URLs
 */
export function getBasePath(): string {
  if (typeof window === "undefined") {
    return "";
  }

  if (cachedBasePath !== null) {
    return cachedBasePath;
  }

  const currentPath = window.location.pathname;
  
  // For localhost or root domain deployments
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    currentPath === "/" ||
    currentPath.split("/").filter(Boolean).length === 0
  ) {
    cachedBasePath = "";
  } else {
    // For subdirectory deployments, extract the base path
    const pathSegments = currentPath.split("/").filter(Boolean);
    // Check if the first segment looks like an app name (not a route)
    if (pathSegments[0] && !pathSegments[0].includes(".")) {
      cachedBasePath = `/${pathSegments[0]}`;
    } else {
      cachedBasePath = "";
    }
  }

  return cachedBasePath;
}

/**
 * Resolve audio file path for both localhost and public URLs
 * @param relativePath - Path relative to /public/audio (e.g., "ambient-calm.mp3")
 * @returns Full path ready for Audio constructor
 */
export function resolveAudioPath(relativePath: string): string {
  const basePath = getBasePath();
  const path = `/audio/${relativePath}`;
  
  if (basePath) {
    return `${basePath}${path}`;
  }
  
  return path;
}

/**
 * Create audio element with resolved path
 */
export function createAudioElement(relativePath: string): HTMLAudioElement {
  const audio = new Audio(resolveAudioPath(relativePath));
  return audio;
}
