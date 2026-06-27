/**
 * Safely access nested object properties.
 */
export function get(object, path, defaultValue = undefined) {
  const keys = path.split('.');
  let result = object;

  for (const key of keys) {
    if (result == null) return defaultValue;
    result = result[key];
  }

  return result ?? defaultValue;
}

/**
 * Delay execution (useful for debounce/throttle helpers).
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
