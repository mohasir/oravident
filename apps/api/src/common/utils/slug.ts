import crypto from 'crypto';

/**
 * Generates a URL-friendly slug from a given string.
 * It normalizes characters (removes accents), converts to lowercase,
 * removes special characters and replaces spaces/underscores with hyphens.
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // separa acentos
    .replace(/[\u0300-\u036f]/g, '') // elimina acentos
    .replace(/[^a-z0-9\s-]/g, '') // solo letras y números reales
    .replace(/\s+/g, '-') // espacios → guiones
    .replace(/-+/g, '-') // múltiples guiones → uno
    .replace(/^-+|-+$/g, ''); // trim de guiones
};

export const randomSuffix = (): string => {
  return crypto.randomBytes(2).toString('hex'); // ej: a3f9
};
