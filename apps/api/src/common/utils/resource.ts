/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Omit fields from an object or an array of objects.
 * Useful for reusing resources and removing sensitive or redundant data.
 */
export function omitFields<T extends object, K extends keyof T>(
  data: T,
  keys: K[],
): Omit<T, K>;

export function omitFields<T extends object, K extends keyof T>(
  data: T[],
  keys: K[],
): Omit<T, K>[];

export function omitFields(data: any, keys: string[]): any {
  if (Array.isArray(data)) {
    return data.map((item) => omitFields(item, keys));
  }

  if (data !== null && typeof data === 'object') {
    const result = { ...data };
    for (const key of keys) {
      delete result[key];
    }
    return result;
  }

  return data;
}
