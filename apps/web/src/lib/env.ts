function requireServerEnv(key: string): string {
  if (typeof window !== 'undefined') return '';
  const value = process.env[key];
  if (!value) throw new Error(`Missing required server environment variable: ${key}`);
  return value;
}

function requirePublicEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const ENV = {
  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  apiUrl: requirePublicEnv('NEXT_PUBLIC_API_URL'),
  serverApiUrl: requireServerEnv('API_URL'),
  authSecret: requireServerEnv('AUTH_SECRET'),
} as const;
